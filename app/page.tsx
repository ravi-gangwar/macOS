"use client"
import { Dock, NavBar, Welcome, BootScreen } from "@/src/components";
import ShutdownManager from "@/src/components/ShutdownManager";
import {Draggable} from "gsap/Draggable"
import gsap from "gsap";
import { Terminal, Contact, Resume, Settings } from "@/src/windows";
gsap.registerPlugin(Draggable);

export default function Home() {
  return (
    <ShutdownManager onShutdown={() => {}}>
      <main>
        <BootScreen />
        <NavBar/>
        <Welcome/>
        <Dock/>
        <Terminal/>
        <Contact/>
        <Resume/>
        <Settings/>
      </main>
    </ShutdownManager>
  );
}
