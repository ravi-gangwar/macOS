export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const stored = localStorage.getItem('macos-portfolio-settings');
              if (stored) {
                const parsed = JSON.parse(stored);
                // Zustand persist stores as { state: { ... } }
                const darkTheme = parsed?.state?.darkTheme;
                const brightness = parsed?.state?.brightness ?? 100;
                
                // Apply dark theme
                if (darkTheme === true) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Apply brightness
                const brightnessValue = 0.3 + (brightness / 100) * 1.2;
                document.body.style.filter = 'brightness(' + brightnessValue + ')';
                document.body.style.transition = 'filter 0.3s ease';
              } else {
                // Default to light theme and 100% brightness
                document.documentElement.classList.remove('dark');
                document.body.style.filter = 'brightness(1.5)';
                document.body.style.transition = 'filter 0.3s ease';
              }
            } catch (e) {
              // On error, default to light theme and 100% brightness
              document.documentElement.classList.remove('dark');
              document.body.style.filter = 'brightness(1.5)';
              document.body.style.transition = 'filter 0.3s ease';
            }
          })();
        `,
      }}
    />
  );
}

