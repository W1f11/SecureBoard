import { useEffect } from "react";
import echo from "./echo";

export default function Notifications() {
  useEffect(() => {
    const handleProjectCreated = (e) => {
      console.log("Notification reçue :", e.project);
      alert("Nouveau projet : " + e.project.title);
    };

    // Écoute l'événement
    const channel = echo.channel("projects").listen(".project.created", handleProjectCreated);

    // Cleanup pour éviter les fuites mémoire
    return () => {
      echo.leaveChannel("projects");
    };
  }, []);

  return <h1>🔔</h1>;
}
