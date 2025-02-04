describe("Weather Dashboard", () => {
    it("displays weather for a city", () => {
      cy.visit("http://localhost:3000");
  
      cy.get('input[placeholder="Enter city name"]').type("Moscow");
      cy.get("button").contains("Search").click();
  
      cy.get("h2").should("contain", "Moscow");
      cy.get("p").should("contain", "Temperature:");
    });
  
    it("displays an error for an invalid city", () => {
      cy.visit("http://localhost:3000");

      cy.get('input[placeholder="Enter city name"]').type("InvalidCityName");
      cy.get("button").contains("Search").click();

      cy.get("p").should("contain", "City not found");
    });
  });