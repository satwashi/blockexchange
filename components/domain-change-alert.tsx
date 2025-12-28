// "use client";

// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";

// const STORAGE_KEY = "domain-change-notice-seen";

// export function DomainChangeAlert() {
//   const [show, setShow] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   const newDomain = process.env.NEXT_PUBLIC_APP_URL;
//   const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Blockechange";

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!newDomain) return;

//     const currentDomain = window.location.hostname;
//     const targetDomain = new URL(
//       newDomain.startsWith("http") ? newDomain : `https://${newDomain}`
//     ).hostname;

//     const seen = localStorage.getItem(STORAGE_KEY);

//     if (currentDomain !== targetDomain && !seen) {
//       setShow(true);
//     }
//   }, [newDomain]);

//   if (!show || !mounted) return null;

//   const dismiss = () => {
//     localStorage.setItem(STORAGE_KEY, "true");
//     setShow(false);
//   };

//   return createPortal(
//     <div className="fixed inset-x-0 top-20 z-[9999] px-1 sm:px-2">
//       <Alert className="relative mx-auto w-full max-w-none bg-background/95 shadow-lg backdrop-blur sm:max-w-2xl">
//         <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
//           <div className="flex items-start gap-3 sm:items-center">
//             <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:mt-0">
//               <span className="text-base">🚀</span>
//             </div>

//             <div className="flex-1 min-w-0">
//               <AlertTitle className="text-base font-semibold text-foreground">
//                 We've moved!
//               </AlertTitle>
//               <AlertDescription className="mt-1 text-sm leading-snug text-muted-foreground">
//                 <span className="block">{appName} is now available at:</span>
//                 <span className="mt-2 block rounded-md bg-muted/50 px-2 py-1.5 font-mono font-medium text-primary">
//                   <span className="block w-full max-w-full overflow-x-auto whitespace-nowrap">
//                     {newDomain}
//                   </span>
//                 </span>
//               </AlertDescription>
//             </div>
//           </div>

//           <div className="flex w-full gap-2 sm:ml-auto sm:w-auto">
//             <Button
//               size="sm"
//               className="flex-1 sm:flex-none"
//               onClick={() => {
//                 dismiss();
//                 const url = newDomain.startsWith("http")
//                   ? newDomain
//                   : `https://${newDomain}`;
//                 window.location.href = url;
//               }}
//             >
//               Go to New Site
//             </Button>

//             <Button
//               size="sm"
//               variant="outline"
//               className="flex-1 sm:flex-none"
//               onClick={dismiss}
//             >
//               Stay Here
//             </Button>
//           </div>

//           <button
//             onClick={dismiss}
//             className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
//             aria-label="Close"
//           >
//             <span className="text-lg leading-none">×</span>
//           </button>
//         </div>
//       </Alert>
//     </div>,
//     document.body
//   );
// }
