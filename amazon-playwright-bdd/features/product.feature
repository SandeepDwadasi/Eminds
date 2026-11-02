@product
Feature: Product details
  As a shopper
  I want to view a product's details
  So that I can decide whether to buy it

  @smoke
  Scenario: Open a product from the search results
    Given I am on the Amazon home page
    When I search for "wireless mouse"
    And I open search result number 1
    Then I should be on the product details page
    And the product title should match the selected result
