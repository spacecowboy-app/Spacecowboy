/*
    Copyright 2021-2023 Rolf Michelsen and Tami Weiss

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import ServiceModelMapping from "../service/servicemodelmapping";
import { Participant, Session } from "../model/apptypes";
import { ParticipantResponse, SessionResponse } from "../service/servicedto";


test("Convert ParticipantResponse to model", () => {
    const input: ParticipantResponse = {
        id: "d97760ed-0e01-4e21-9e7f-d588233ad2b2",
        name: "clyde",
        avatar: "clyde-avatar",
        idle: 42,
        vote: "75daeb91-67f8-4456-9945-0568df1f5a9e"
    };

    const output: Participant = ServiceModelMapping.GetParticipant(input);

    expect(output.id).toBe("d97760ed-0e01-4e21-9e7f-d588233ad2b2");
    expect(output.avatar.name).toBe("clyde");
    expect(output.avatar.image).toBe("clyde-avatar");
    expect(output.idle).toBe(42);
    expect(output.vote).toBe("75daeb91-67f8-4456-9945-0568df1f5a9e");
});


test("Convert SessionResponse to model", () => {

    const input: SessionResponse = {
        id: "foo-bar",
        cards: [],
        createTime: "2021-01-01T00:00:00Z",
        generation: 0,
        votingCompleted: false
    };

    const output: Session = ServiceModelMapping.GetSession(input);

    expect(output.id).toBe("foo-bar");
    expect(output.createTime).toBe("2021-01-01T00:00:00Z");
    expect(output.generation).toBe(0);
    expect(output.votingCompleted).toBeFalsy();
});
