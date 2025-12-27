import { Suspense } from "react";
import VerifierPage from "./_components";
import { AppLoader } from "@/components/Loader/app-loader";

export default function Page() {
  return (
    <Suspense fallback={<AppLoader size={80} />}>
      <VerifierPage />
    </Suspense>
  )
}
