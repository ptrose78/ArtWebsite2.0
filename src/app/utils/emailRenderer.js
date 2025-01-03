// utils/emailRenderer.js
export function renderEmailTemplate(templateName, data) {
    const sharedStyles = {
      mainContainer: "font-family: Arial, sans-serif; max-width: 600px;",
      header: "text-align: center; margin-bottom: 30px;",
      // ... more shared styles
    };
  
    const templates = {
      orderConfirmation: ({ orderNumber, items, total }) => `
        <div style="${sharedStyles.mainContainer}">
          <!-- Template content -->
        </div>
      `,
      // ... more templates
    };
  
    return templates[templateName](data);
  }