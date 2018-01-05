# Synthesizer
Basic synth with sequencer

This is a synthesizer with some basic functionality, including a waveform selector, sustain and distortion options, color change based on chord-type, and a sequencer that can be updated in real time. As of this time, it's unfinished (I want to add more functionality and really need to clean up the code).

The technologies used to create this were:
  - WebAudio API
  - React
  - React-Redux
  - Sequelize
  - Express
  - PostgreSQL
  
Since I didn't have any prior knowledge of the WebAudio API, the online resources I found most helpful were personal blogs from people who decided to step through common issues and beginner questions with it. https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-api-part-1/, for example. I also relied heavily on Mozilla Developer Network and W3 schools' info on the WebAudio API, as well as how to handle certain unfamiliar events using react (such as keyDown, keyUp, etc.)