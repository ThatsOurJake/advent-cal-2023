'use server';
import getConfig from "next/config";
import HomeClosed from "./home-closed";
import HomeOpen from "./home-open";

export default async function Home() {
  const { publicRuntimeConfig } = getConfig();
  const showWinnerDate = new Date(publicRuntimeConfig.showWinnerDate).valueOf();

  const showWinnerScreen = Date.now() > showWinnerDate;

  if (showWinnerScreen) {
    return (<HomeClosed />);
  }

  return (<HomeOpen />);
};
