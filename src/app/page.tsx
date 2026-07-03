import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import Image from "next/image";
import User from "./models/user.model";
import connectDb from "@/lib/db";

export default async function Home() {
  const session = await auth();
  await connectDb();
  const user = await User.findOne({ email: session?.user?.email });

  return (
    <div className="w-full min-h-screen bg-white">
      {user?.role == "partner" ? (
        <>
          <Nav />
          <PartnerDashboard />
        </>
      ) : user?.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          <Nav />
          <PublicHome />
        </>
      )}

      <Footer />
    </div>
  );
}
