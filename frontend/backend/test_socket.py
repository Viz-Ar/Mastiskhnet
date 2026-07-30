import asyncio
import websockets
import json



async def test():


    uri="ws://127.0.0.1:8000/chat/ws/1"


    async with websockets.connect(uri) as ws:


        await ws.send(
            json.dumps({

                "receiver_id":2,

                "message":
                "Hello Doctor"

            })
        )



        response = await ws.recv()


        print(response)



asyncio.run(test())