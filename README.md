# ShopNav

## Team Name
Mr Impatient

## Problem Motivation

Large shopping malls can be a confusing and time-consuming task. Shoppers often struggle to find specific stores or services, and they may miss out on new stores that match their interests. Furthermore, it might be a hassle to find a directory at the mall

## Development Plan

We plan to start by developing the core features of the app: mall navigation and shop search. Once these features are stable, we will implement personalized recommendations. Throughout the development process, we will continue to refine the user interface and improve the accuracy of our recommendations.

## Proposed Level of Achievement

Apollo 11

## Description

ShopNav is a mobile application that provides a  one-stop solution for efficient mall navigation and personalized shop recommendation.

It simplifies the mall navigation experience by providing users with an interactive mall directory, a powerful shop search feature, and personalized shop recommendations. This application aims to streamline the shopping experience, save time, and introduce users to new stores that align with their preferences.



## Solution Description & Impact

Our application aims to provide a **detailed and interactive directory** of shopping malls to show the overall layuout of the mall.

Having a **search function** also makes it easier for users to find specific shops and services. 


Additionally, our **personalized recommendation** feature introduces users to shops they may be interested in, enhancing their shopping experience and potentially increasing foot traffic for stores. This solution makes shopping trips more efficient and enjoyable, benefiting both shoppers and stores.

## Core Features & User Stories(UNSURE OF STORIES)

1. **Mall Directory**: As a user, I want to be able to see the layout of the mall so that I know what are the stores available.
2. **Mall Navigation**: As a user, I want to be able to navigate the mall efficiently so I can spend less time finding the stores I need.
3. **Shop Search**: As a user, I want to search for specific stores so I can easily locate them in the mall.
4. **Personalized Recommendations**: As a user, I want to receive personalized shop recommendations so I can discover new stores that align with my interests.

## Use Cases

1. **Mall Navigation**: User opens the app and chooses their current mall from a list. The app shows an interactive map of the mall, with the user's current location marked.
2. **Shop Search**: User enters a store name in the search bar. The app shows where the store is located in the mall and the best route from the user's current location.
3. **Personalized Recommendations**: Based on the user's shopping history and preferences, the app suggests other stores in the mall that the user may be interested in.

## How the App Works

When the user opens the app, they can select their current mall or malls that they are interested in. They can then look at the overall layout of the mall.

They can use the navigation function, input the initial stall and destination stall, and the application will provide the shortest path from the initial store to the destination store.

They can also search for a specific store that they are interested in. ShopNav will list out the details of the store like opening hours, location and promotions. It will also show the existing malls that have that store. 

Users can also view their personalized recommendations. The application will have an accumulation of scores of different stores based on their shopping history and preferences, and then recommend a stall for them when queried.

## Database Use + Structure

The app uses a relational database with tables for users, stores, malls, and shopping history. Each mall has a list of stores, each user has a shopping history, and each store has a list of associated malls.

## System Testing

We use a combination of unit tests, integration tests, and end-to-end tests to ensure our system works as expected. Unit tests cover individual components, integration tests cover interactions between components, and end-to-end tests cover complete user flows. We plan to continue developing these tests as we add new features.





