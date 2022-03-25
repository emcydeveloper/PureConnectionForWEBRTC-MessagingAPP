document.getElementById("clientA").addEventListener("click", ClientA);

async function ClientA() {
  //Creating PC-A RTCP Connection
  const peerConnectionA = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        {
          url: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
        {
          url: "turn:192.158.29.39:3478?transport=udp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
        {
          url: "turn:192.158.29.39:3478?transport=tcp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
        {
          url: "turn:turn.bistri.com:80",
          credential: "homeo",
          username: "homeo",
        },
        {
          url: "turn:turn.anyfirewall.com:443?transport=tcp",
          credential: "webrtc",
          username: "webrtc",
        },
      ],
    });

  console.log("offer");

  //Mentionin what kind of data been shared
  const sendChannel = peerConnectionA.createDataChannel("sendChannel");

  //Creating PC-A OFFER
  const offer = await peerConnectionA.createOffer();

  console.log(`Am dispalying offer - ${JSON.stringify(offer)}`);

  //Sets the local description of the connection to be this SDP by calling setLocalDescription()
  await peerConnectionA.setLocalDescription(offer);

  //   signaling.send(JSON.stringify({
  //     message_type: MESSAGE_TYPE.SDP,
  //     content: offer,
  //   }));

  //Creating PC-B RTCP Connection
  const peerConnectionB = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        {
          url: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
        {
          url: "turn:192.158.29.39:3478?transport=udp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
        {
          url: "turn:192.158.29.39:3478?transport=tcp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
        {
          url: "turn:turn.bistri.com:80",
          credential: "homeo",
          username: "homeo",
        },
        {
          url: "turn:turn.anyfirewall.com:443?transport=tcp",
          credential: "webrtc",
          username: "webrtc",
        },
      ],
    });

  //Setting PC-A offer to PC-B
  await peerConnectionB.setRemoteDescription(offer);

  //Creating PC-B Answer
  const answer = await peerConnectionB.createAnswer();
  console.log(`Am dispalying Answer - ${JSON.stringify(answer)}`);

  //Sets the local description of the connection to be this SDP by calling setLocalDescription().
  await peerConnectionB.setLocalDescription(answer);

  //Receive answer from PC-B and sets it as the remote description in RTCPeerConnection object calling setRemoteDescription()
  await peerConnectionA.setRemoteDescription(answer);

  console.log("ICE");
  //Creating icecandidate for PC-A and PC-B with type of data they sharing
  peerConnectionA.onicecandidate = (iceEvent) => {
    candidateFromA(iceEvent.candidate);
  };

  peerConnectionB.onicecandidate = (iceEvent) => {
    candidateFromB(iceEvent.candidate);
  };

  //Interchaning the ice candidate between PC-A and PC-B
  async function candidateFromA(candidateA) {
    console.log(`PC-A icecandetate ${JSON.stringify(candidateA)}`);
    await peerConnectionB.addIceCandidate(candidateA);
  }

  //Interchaning the ice candidate between PC-A and PC-B
  async function candidateFromB(candidateB) {
    console.log(`PC-B icecandetate ${JSON.stringify(candidateB)}`);
    await peerConnectionA.addIceCandidate(candidateB);
  }

  //PC-A sends message on connection opens
  sendChannel.onopen = (e) => {
    console.log("connection opened");
    sendChannel.send("messsage from A");
    document
      .getElementById("clientASend")
      .addEventListener("click", () =>
        sendChannel.send(document.getElementById("PC-A-text").value)
      );
  };

  //PC-A receive messages upon connection opens
  sendChannel.onmessage = (e) => {
    console.log(e.data);
    document.getElementById(
      "PC-A-Message"
    ).innerHTML += `<br />Message from B: ${e.data}`;
  };

  //PC-B Send/receive messages upon connection opens
  peerConnectionB.ondatachannel = (e) => {
    const receiveChannel = e.channel;
    receiveChannel.send("Message from B");
    document
      .getElementById("clientBSend")
      .addEventListener("click", () =>
        receiveChannel.send(document.getElementById("PC-B-text").value)
      );
    receiveChannel.onmessage = (e) => {
      console.log("messsage received!!!" + e.data);
      document.getElementById(
        "PC-B-Message"
      ).innerHTML += `<br />Message from A: ${e.data}`;
    };
  };
}
