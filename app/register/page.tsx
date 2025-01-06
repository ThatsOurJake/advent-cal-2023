import getConfig from "next/config";

import RegistrationOpen from "./registration-open";
import RegistrationClosed from "./registration-closed";

const Register = () => {
  const { publicRuntimeConfig } = getConfig();
  const cutoffDay = publicRuntimeConfig.registrationCutoffDay;
  const day = new Date().getDay();

  const registrationOpen = day <= cutoffDay;

  return registrationOpen ? (<RegistrationOpen />) : (<RegistrationClosed />);
};

export default Register;
