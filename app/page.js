import Feed from "@/components/Feed";

export default function Home() {
  
  return (
    <main className="h-screen" >
      <section className="w-full flex-center flex-col py-16 text-gray-800">
        <h1 className="text-4xl text-center font-bold">
          Your Health and Wellness Partner
          <br />
          <span className="text-6xl mt-1.5">Health Hub</span>
        </h1>
        <p className="text-2xl text-center mt-2">
          Your one-stop shop for health and wellness products
        </p>
        <Feed />
      </section>
    </main>
  );
}
