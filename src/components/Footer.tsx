import React from "react";

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 text-center border-t border-border">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} All rights reserved. Created with{" "}
        <span className="text-green-500">💚</span> by{" "}
        <a
          href="https://www.codedome.co.za"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Code Dome
        </a>
      </p>
    </footer>
  );
};