import { Suspense } from "react";
import { Desktop } from "@/components/os/Desktop";
import { GithubWidget } from "@/components/os/GithubWidget";

export default function Home() {
  return (
    <Desktop
      githubWidget={
        <Suspense fallback={null}>
          <GithubWidget />
        </Suspense>
      }
    />
  );
}
