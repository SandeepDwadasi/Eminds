@cart
Feature: Shopping cart
  As a shopper
  I want to add and remove products in my cart
  So that I can manage what I am going to buy

  Background:
    Given I am on the Amazon home page
    And my delivery ZIP code is "10001"
    And my cart is empty

  @smoke
  Scenario: Add a product to the cart
    When I search for "AmazonBasics AA batteries"
    And I open search result number 1
    And I add the product to the cart
    Then the cart count should be 1
    When I open the cart
    Then the cart should contain 1 item

  @regression
  Scenario: Remove a product from the cart
    When I search for "AmazonBasics AA batteries"
    And I open search result number 1
    And I add the product to the cart
    And I open the cart
    And I remove the first item from the cart
    Then the cart should be empty
