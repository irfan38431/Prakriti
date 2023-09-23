import { useState } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";
//import Chatbox from "./Chatbox";

const Controller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  //const [text, settext]=useState<any[]>([]);

  function createBlobURL(data: any) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }
  // function createBlobURLT(data: any) {
  //   const blob = new Blob([data], { type: "plain/text" });
  //   const url = window.URL.createObjectURL(blob);
  //   return url;
  // }

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);

    // Append recorded message to messages
    const myMessage = { sender: "me", blobUrl };
    const messagesArr = [...messages, myMessage];

    // convert blob url to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        // Construct audio to send file
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");

        // send form data to api endpoint
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
            responseType: "arraybuffer", // Set the response type to handle binary data
          })
          .then((res: any) => {
            const blob = res.data;
            const audio = new Audio();
            audio.src = createBlobURL(blob);

            // Append to audio
            const praMessage = { sender: "prakriti", blobUrl: audio.src };
            messagesArr.push(praMessage);
            setMessages(messagesArr);

            // Play audio
            setIsLoading(false);
            audio.play();
          })
          .catch((err: any) => {
            console.error(err);
            setIsLoading(false);
          });
      });
  };
  // const handleStopT = async (textMessage: string) => {
  //   setIsLoading(true);
  
  //   // Append recorded message to messages
  //   const myMessage = { sender: "me", textMessage }; // Use textMessage instead of blobUrl
  //   const messagesArr = [...messages, myMessage];
  
  //   // Convert text message to a Blob object
  //   const blob = new Blob([textMessage], { type: "text/plain" });
  
  //   // Construct FormData with the Blob
  //   const formData = new FormData();
  //   formData.append("file", blob, "myFile.txt"); // Use a .txt extension for text files
  
  //   // Send form data to the API endpoint
  //   try {
  //     const response = await axios.post("http://localhost:8000/post-text", formData, {
  //       headers: {
  //         "Content-Type": "text/plain", // Set the Content-Type for text
  //       },
  //     });
  
  //     // Append the received text message to messages
  //     const receivedTextMessage = response.data;
  //     const praMessage = { sender: "prakriti", textMessage: receivedTextMessage };
  //     messagesArr.push(praMessage);
  //     setMessages(messagesArr);
  
  //     // Clear loading state
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     setIsLoading(false);
  //   }
  // };
  
  return (
    <div className="h-screen overflow-y-hidden bg-green-100">
      {/* Title */}
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96 border-t-green-700">
        {/* Conversation */}
        <div className="mt-5 px-5">
          {messages?.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  "flex flex-col " +
                  (audio.sender == "prakriti" && "flex items-end")
                }
              >
                {/* Sender */}
                <div className="mt-4 ">
                  <p
                    className={
                      audio.sender == "Prakriti"
                        ? "text-right mr-2 italic text-green-500"
                        : "ml-2 italic text-blue-500"
                    }
                  >
                    {audio.sender}
                  </p>

                  {/* Message */}
                  <audio
                    src={audio.blobUrl}
                    className="appearance-none"
                    controls
                  />
                </div>
              </div>
            );
          })}

          {messages.length == 0 && !isLoading && (
            <div className="text-center font-light italic mt-10">
              Send Prakriti a message...
            </div>
          )}

          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Gimme a few seconds...
            </div>
          )}
        </div>
        
        {/* Recorder */}
        <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-green-900 to-green-500">
          <div className="flex justify-end items-right w-full ">
            <div>
              <RecordMessage handleStop={handleStop} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;