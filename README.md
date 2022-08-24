# Signalytics Service Template

**make sure to run `npm run lint and npm run test` before pushing!**

### Requirements
1. Clone repo
2. Remove unnecessary controller that are not needed for the new service.
3. package.json - replace package name eg: `my-service`
4. uncomment cd workflow in `.github/workflow/cicd.yml` and replace env -> IMAGE_NAME with your `my-service`


### Issues
1. Jest RANDOMBYTESREQUEST error in local machine please see [here](https://stackoverflow.com/questions/65653226/jest-and-randombytesrequest-open-handles)

### Development

Requirements: NodeJS and MongoDB

Simply run  `npm run dev`

### Linting

Simply run  `npm run lint`

### Tests

Simply run  `npm run test`


# License

MIT License

Copyright (c) 2021 Keith Levi Lumanog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

