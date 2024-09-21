const servers = [
  {
    id: "1",
    name: "Tech Community",
    imageUrl:
      "https://img.pikbest.com/wp/202348/discord-modern-minimalistic-gradient-background-image-for-corporate-social-media_9779628.jpg!sw800",
    channels: [
      {
        id: "101",
        name: "general-chat",
        type: "text", // Text Channel
      },
      {
        id: "102",
        name: "coding-help",
        type: "text", // Text Channel
      },
      {
        id: "103",
        name: "voice-room-1",
        type: "voice", // Voice Channel
      },
      {
        id: "104",
        name: "gaming-room",
        type: "voice", // Voice Channel
      },
    ],
  },
  {
    id: "2",
    name: "Gaming Friends",
    imageUrl:
      "https://img.freepik.com/free-photo/futuristic-moon-background_23-2150930800.jpg",
    channels: [
      {
        id: "201",
        name: "game-chat",
        type: "text", // Text Channel
      },
      {
        id: "202",
        name: "strategy-discussion",
        type: "text", // Text Channel
      },
      {
        id: "203",
        name: "voice-room-2",
        type: "voice", // Voice Channel
      },
      {
        id: "204",
        name: "party-voice",
        type: "voice", // Voice Channel
      },
    ],
  },
  {
    id: "3",
    name: "Music Lovers",
    imageUrl:
      "https://pbs.twimg.com/media/EhL0hv4XsAIpNI2?format=jpg&name=large",
    channels: [
      {
        id: "301",
        name: "music-chat",
        type: "text", // Text Channel
      },
      {
        id: "302",
        name: "playlist-sharing",
        type: "text", // Text Channel
      },
      {
        id: "303",
        name: "karaoke-room",
        type: "voice", // Voice Channel
      },
      {
        id: "304",
        name: "jam-session",
        type: "voice", // Voice Channel
      },
    ],
  },
];

export default servers;
