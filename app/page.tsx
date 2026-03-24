import GetStartedFrom from "@/components/GetStartedFrom";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <p>Level Up Your Game</p>
      <h1>Backed by 200 million+ organic views, join the community today</h1>
      <h4>Hanna, Angela and Savera are three of the strongest UGC coaches in the industry. Fill out the form below to get started.</h4>
      <p>Check Out the Results</p>
      <div className="flex flex-col items-center justify-center">
        <Image src="/results.png" alt="results" width={500} height={500} />
      </div>
      <GetStartedFrom/>
    </div>
  );
}
