import asyncio
import websockets
import json



async def chat():

    uri = "ws://127.0.0.1:8000/chat/ws/1"


    async with websockets.connect(uri) as websocket:


        await websocket.send(

            json.dumps({

                "receiver_id":2,

                "message":
                "Hello Doctor, my MRI report is ready"

            })

        )



        response = await websocket.recv()


        print(response)




asyncio.run(chat())