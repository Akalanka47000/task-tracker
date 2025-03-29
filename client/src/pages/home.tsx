import { Protect } from "@/components/auth";
import {EmployeeTable} from "@/components/employees";

function Home() {
  return <div className="flex w-full h-full flex-1 flex-col space-y-8 p-8 md:p-10">
    <EmployeeTable/>
  </div>;
}

export default Protect(Home)