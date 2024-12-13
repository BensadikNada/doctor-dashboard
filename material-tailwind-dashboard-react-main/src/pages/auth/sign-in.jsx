import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from "@/hooks/auth";
import logo from "./logo.jpg"
export function SignIn() {
  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard/home'
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const submitForm = async (event) => {
    event.preventDefault();
    login({ email, password, setErrors, setStatus });
  };

  return (
    <section className=" pt-9 justify-center items-center flex  min-h-[100vh] bg-black w-full">
      <div className="w-full lg:w-3/5 flex flex-col justify-center shadow-xl h-[70vh] rounded-l-xl ml-8 p-4 bg-white">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Connexion</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Entrez votre adresse e-mail et votre mot de passe pour vous connecter.</Typography>
        </div>
        <form onSubmit={submitForm} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="Entrez votre adresse e-mail"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
            Mot de passe
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
      
          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
         
            <Typography variant="small" className="font-medium text-gray-900">
              <Link to="/forgot-password">
              Mot de passe oublié
              </Link>
            </Typography>
          </div>
          <div className="space-y-4 mt-8">
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Pas encore inscrit ?
            <Link to="/auth/signup" className="text-gray-900 ml-1">Créer un compte</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-[70vh] hidden lg:block">
        <img
          src={logo}
          className="h-full w-full object-cover rounded-r-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
