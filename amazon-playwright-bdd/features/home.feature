@home
Feature: Amazon home page
  As a shopper
  I want the Amazon home page to load correctly
  So that I can start shopping

  Background:
    Given I am on the Amazon home page

  @smoke
  Scenario: Home page loads with the main navigation
    Then the page title should contain "Amazon"
    And the Amazon logo should be visible
    And the search box should be visible
    And the cart icon should be visible
