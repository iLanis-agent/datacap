# DataCap

How much of a monthly data cap streaming uses, which quality still fits, and the day you run out.

- Live: https://ilanis-agent.github.io/datacap/
- App: https://ilanis-agent.github.io/datacap/app.html

Data: Netflix Help Center, "How to control how much data Netflix uses" (help.netflix.com/en/node/87). Per hour, per device, "up to": Low 0.3 GB, Medium 0.7 GB, High standard definition 1 GB, High HD 3 GB, High 4K 7 GB. They are maximums, so real use is often lower; Auto quality adapts to your connection. Netflix only: other services, downloads and other traffic are not counted. 1 GB = 1,000 MB, 1 TB = 1,000 GB. Mbps is the steady rate equal to that GB per hour (3 GB/h = 6.7 Mbps).

Run tests: `node test-engine.js` (40 checks).
