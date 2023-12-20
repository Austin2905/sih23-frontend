import Header from "./Header";
import Footer from "./Footer";
import Stats from "./Stats";
import AddToCalendar from "./AddToCalendar";

const Dashboard = () => {
  return (
    <>
      <Header />
      <main
        id="dashboard"
        className="mt-10 mx-2 lg:mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:px-8 min-h-85 flex flex-col"
      >
        <AddToCalendar />
        <Stats />
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
