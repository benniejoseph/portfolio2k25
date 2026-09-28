---
slug: apex-in-winter-27-testing-api-v68-changes-before-your-org-up
sourceUrl: >-
  https://www.bennierichard.com/blog/apex-in-winter-27-testing-api-v68-changes-before-your-org-up
generatedAt: '2026-09-28T08:58:20.725Z'
model: gpt-6-astra
maxWords: 180
maxCharacters: 2600
wordCount: 141
characterCount: 1086
humanReviewRequired: true
---
An org upgrade, an Apex class API-version change, and a test runner’s endpoint-version change are three different boundaries. Testing them together makes failures harder to explain.

In this article, I recommend starting with unchanged Apex on the Winter ’27 runtime. Then test selected components at v68, keeping fixtures, permissions, packages, and settings as consistent as possible.

Test Discovery deserves its own check: at API v68, testLevel replaces showAllMethods. A green run isn’t enough if the runner selected the wrong tests. Record discovered and executed test identities, not just counts.

Keep developer-preview and beta experiments separate from baseline readiness, and verify availability in the target org. Promotion should depend on business assertions, security checks, and operational evidence—not compilation alone.

Can your upgrade tests distinguish a runtime change from a class-version change or an unexpected shift in test selection?

https://www.bennierichard.com/blog/apex-in-winter-27-testing-api-v68-changes-before-your-org-up

#Salesforce #Apex #Testing
