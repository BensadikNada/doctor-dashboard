import {
  HomeIcon,
  UserCircleIcon,
  CalendarIcon,BuildingOffice2Icon,FolderOpenIcon,ArrowLongLeftIcon
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import Users from "./pages/dashboard/Users";
import SalleDAttente from "./pages/dashboard/Salle";
import { Reservation } from "./pages/dashboard/Reservation";
import { Calender } from "./pages/dashboard/Calender";
import Folder from "./pages/dashboard/Folder";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Tableau de bord",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Patients",
        path: "/patients",
        element: <Users />,
      },
      {
        icon: <BuildingOffice2Icon {...icon} />,
        name: "Salle d'attente",
        path: "/salle",
        element: <SalleDAttente />,
      },  
      {
        icon: <CalendarIcon {...icon} />,
        name: "Rendez-vous",
        path: "/reservation",
        element: <Reservation />,
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Calendrier",
        path: "/calender",
        element: <Calender />,
      },
      {
        icon: <FolderOpenIcon {...icon} />,
        name: "Dossiers des patients",
        path: "/Folder",
        element: <Folder />,
      },
    ],
  },
];

export default routes;
