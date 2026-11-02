@search
Feature: Product search
  As a shopper
  I want to search the Amazon catalogue
  So that I can find products I am interested in

  Background:
    Given I am on the Amazon home page

  @smoke
  Scenario: Search returns matching results
    When I search for "wireless mouse"
    Then I should see search results
    And at least 3 result titles should contain "mouse"

  @regression
  Scenario Outline: Search works for different product categories
    When I search for "<term>"
    Then I should see search results
    And the page URL should contain "k="

    Examples:
      | term         |
      | laptop       |
      | headphones   |
      | coffee maker |

  @regression @negative
  Scenario: Search with a nonsense term shows no results
    When I search for a random nonsense term
    Then I should see a no results message

  @regression
  Scenario: Sort search results by price low to high
    When I search for "usb c cable"
    And I sort the results by "price-low-to-high"
    Then the listed prices should be in ascending order
