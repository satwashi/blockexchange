import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/user/users";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "kyc_documents";
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 5MB.",
        },
        { status: 400 }
      );
    }

    // Check if bucket exists, create if it doesn't
    const { data: buckets, error: bucketsError } =
      await supabaseAdmin.storage.listBuckets();
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      return NextResponse.json(
        { error: "Failed to access storage" },
        { status: 500 }
      );
    }

    const bucketExists = buckets?.some((b) => b.name === bucket);
    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(
        bucket,
        {
          public: true,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
          fileSizeLimit: 5242880, // 5MB
        }
      );

      if (createError) {
        console.error("Error creating bucket:", createError);
        return NextResponse.json(
          { error: `Failed to create bucket: ${createError.message}` },
          { status: 500 }
        );
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = folder
      ? `${folder}/${session.id}_${timestamp}_${file.name}`
      : `${session.id}_${timestamp}_${file.name}`;

    // Upload file to Supabase storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        {
          error: error.message,
          details: "Upload failed",
        },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
