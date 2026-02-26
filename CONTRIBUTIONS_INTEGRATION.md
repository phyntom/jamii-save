# Contributions feature Design decisions

## Pre-requisites

1. Having working community creation. A community is needed for the business logic to work

## Steps involved

1. Created DB schema and any objects needed
2. Design the UI to use. References, Jamii-Save prototype, Shadcn UI template
   1. Pages
   2. Components
3. Implement business logic for the UI utilizing the DB
   1. Server functions
   2. file uploading on cloudinary

## Functional requirements

1. User should be able to record a contribution
2. User should be able to update contribution
3. community admins should be able to approve or reject a contribution

### To be done later - depends on transactions

1. Contribution approval should update community metrics - Not yet supported

## Non-Functional requirements

1. Member should only be able to update contribution before it is approved or rejected
2. Only community admins should be able to approve or reject contributions
