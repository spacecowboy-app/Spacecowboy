/*
    Copyright 2021-2026 Rolf Michelsen and Tami Weiss

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

import Deck from "@/model/Deck";
import DeckCategoryFilter from "./model/DeckCategoryFilter";
import DecksCollection from "./model/DecksCollection";


const decks: Deck[] = [
/*
    {
        id: "143098ea-92d5-42e0-b2d3-1093895a6e37",
        name: "Xmas",
        type: "Fibonacci",
        cards: [
            { id: "86f80f2d-ebb6-4877-9c28-ef54c35dcbc2", value:"0", color: "marigold", image: "xmas/0candycane.png", font: "large", style: "value-image" },
            { id: "b133a64e-27e4-4a9f-84a7-6a73147ac0e6", value:"1", color: "tangerine", image: "xmas/1ornament.png", font: "large", style: "value-image" },
            { id: "72602692-f1f6-4be0-a4be-6400ec543896", value:"2", color: "tangerine", image: "xmas/2gingerbread.png", font: "large", style: "value-image" },
            { id: "8b2064d0-bd83-4be8-a527-8aa13c34b50a", value:"3", color: "tangerine", image: "xmas/3stocking.png", font: "large", style: "value-image" },
            { id: "e1d6ace6-2064-4460-9225-4e4ff2cbfdd6", value:"5", color: "coral", image: "xmas/5elf.png", font: "large", style: "value-image" },
            { id: "28b1e00d-aeda-418c-9ad1-bd0c1eb6c58f", value:"8", color: "coral", image: "xmas/8sweater.png", font: "large", style: "value-image" },
            { id: "0ab17306-1f2c-4386-ad0f-cd7666299f43", value:"13", color: "coral", image: "xmas/12present.png", font: "large", style: "value-image" },
            { id: "99b5b8f9-9a18-4cf7-91a0-444684886af3", value:"21", color: "bubblegum", image: "xmas/21reindeer.png", font: "large", style: "value-image" },
            { id: "e5e0eb69-d267-464c-b292-455c87890cd3", value:"34", color: "bubblegum", image: "xmas/34xmastree.png", font: "large", style: "value-image" },
            { id: "f0ee5dcd-e4a7-43cc-ac55-1ad7ae8323cc", value:"\u221e", color: "teal", image: "xmas/infinitysled.png", font: "large", style: "value-image" },
            { id: "a5d108d0-a8cc-4bad-92bd-29942a5e0f2c", value:"no idea", color: "ocean", image: "xmas/idksanta.png", font: "small", style: "value-image" },
            { id: "0c871809-883c-429e-8776-81f4e80abc1e", value:"break", color: "jade", image: "xmas/pausewine.png", font: "small", style: "value-image" },
        ],
        flipped: { id: "cb6488c1-4b53-4553-a40d-b500475a4770", color: "darkgray", image: "xmas/flipped.png", style: "centered-image" },
        notflipped: { id: "e61bd883-9671-4138-a95a-d88f42894116", color: "lightgray", image: "xmas/notflipped.png", style: "centered-image" },
        decktop: { id: "d8c283f5-8bb7-4226-b470-efc9e12d071f", value:"xmas", color: "marigold", image: "xmas/idksanta.png", font: "small", style: "image-value" },
        noVote: { id: "9acbb51b-cd74-4462-b94b-04e533b0c99e" },
        hiddenVote: { id: "f7867b00-7622-4ba5-895f-3b419729092f" }
    },
*/
/*
    {
        id: "0e76b80e-587c-4406-9a38-a74ae7010640",
        name: "Halloween",
        type: "Fibonacci",
        cards: [
            { id: "9346b31a-be6a-4440-85b6-b36500be1ba7", value:"0", color: "marigold", image: "halloween/halloweencandy.png", font: "large", style: "value-image" },
            { id: "8d13a14c-68b6-4a54-a1ac-b48d70485e11", value:"1", color: "tangerine", image: "halloween/1witchhat.png", font: "large", style: "value-image" },
            { id: "6bf69024-a7ce-47ef-96ff-bc6669437dec", value:"2", color: "tangerine", image: "halloween/2bat.png", font: "large", style: "value-image" },
            { id: "dcaa67e1-7f42-4c6f-9cd5-57a552357d59", value:"3", color: "tangerine", image: "halloween/3pumpkin.png", font: "large", style: "value-image" },
            { id: "f9b97479-3ed0-4157-9e1d-a933ceed4000", value:"5", color: "coral", image: "halloween/5cat.png", font: "large", style: "value-image" },
            { id: "fb85ff49-6751-46b2-b776-b913cd11e2e2", value:"8", color: "coral", image: "halloween/8ghost.png", font: "large", style: "value-image" },
            { id: "66d15038-a4a7-4fcb-aa91-03fb8541dc8b", value:"13", color: "coral", image: "halloween/13coffin.png", font: "large", style: "value-image" },
            { id: "9a5dae58-6789-4034-bdb5-278585029cb4", value:"21", color: "bubblegum", image: "halloween/21franknstein.png", font: "large", style: "value-image" },
            { id: "e2747b74-59c4-48a1-895f-a051e1db5d1c", value:"34", color: "bubblegum", image: "halloween/34hauntedhouse.png", font: "large", style: "value-image" },
            { id: "a130be59-8128-4ed3-b4f3-959db59ef3f1", value:"\u221e", color: "teal", image: "halloween/infinitydeath.png", font: "large", style: "value-image" },
            { id: "a6e96093-1eb3-4108-9930-b3f89a684f46", value:"no idea", color: "ocean", image: "halloween/graveidk.png", font: "small", style: "value-image" },
            { id: "47b434f6-f4e7-472c-b245-cccc5e67049f", value:"break", color: "jade", image: "halloween/zbrew.png", font: "small", style: "value-image" }
        ],
        flipped: { id: "08ede683-ba82-44f7-8130-be23cda62920", color: "darkgray", image: "flipped.png", style: "centered-image" },
        notflipped: { id: "3c8eb800-7843-4d0c-b151-c312cbed9877", color: "lightgray", image: "notflipped.png", style: "centered-image" },
        decktop: { id: "b5fd4e69-5ba7-4b3e-8e8b-f42d72f83dfe", value:"halloween", color: "marigold", image: "halloween/pumpkindeck.png", font: "small", style: "image-value" },
        noVote: { id: "a981f68f-7ef5-47cd-a55a-ef1048a5e778" },
        hiddenVote: { id: "d7e56a12-3d59-4a10-9991-87aac17bf43a" },
    },
*/
    {
        id: "5f007d6a-5ae6-4158-8975-87b6f3364d97",
        name: "High Noon",
        type: "Fibonacci",
        cards: [
            { id: "a863d9f5-3861-4ffe-881d-14cfd62999da", value:"0", color: "marigold", image: "cowboy/eagle.png", font: "large", style: "value-image" },
            { id: "2e27ed82-846a-411a-84cf-fa7a4fc61547", value:"1", color: "tangerine", image: "cowboy/cactus.png", font: "large", style: "value-image" },
            { id: "b9a966e1-baf9-467b-8e32-29fd9693484d", value:"2", color: "tangerine", image: "cowboy/horseshoe.png", font: "large", style: "value-image" },
            { id: "dc41645e-51c2-423b-be90-867ae1e0df31", value:"3", color: "tangerine", image: "cowboy/boot.png", font: "large", style: "value-image" },
            { id: "d545bda1-768c-4dab-817e-056ae5a28cb3", value:"5", color: "coral", image: "cowboy/armadillo.png", font: "large", style: "value-image" },
            { id: "5ad59a74-9891-410b-83a4-4d5e9a257d98", value:"8", color: "coral", image: "cowboy/horse.png", font: "large", style: "value-image" },
            { id: "02da5ac7-cdc7-4fb9-b81d-92a244c21839", value:"13", color: "coral", image: "cowboy/barrel.png", font: "large", style: "value-image" },
            { id: "39ad0107-57f3-4995-9890-88ded308ef22", value:"21", color: "bubblegum", image: "cowboy/wagon.png", font: "large", style: "value-image" },
            { id: "7392dcc5-aa02-4e8f-aa87-7f527f1e60e2", value:"34", color: "bubblegum", image: "cowboy/tower.png", font: "large", style: "value-image" },
            { id: "449f5212-6f08-4dc7-ae40-d4e216355bae", value:"\u221e", color: "teal", image: "cowboy/infinity.png", font: "large", style: "value-image" },
            { id: "a5e2581e-ad60-44e6-bdb9-39666b310835", value:"?", color: "ocean", image: "cowboy/cowskull.png", font: "large", style: "value-image" },
            { id: "fcb8442d-828d-43d9-b875-3368fe3254ce", value:"break", color: "jade", image: "cowboy/hangingclock.png", font: "small", style: "value-image" }
        ],
        flipped: { id: "830b9f67-28a1-453d-b6c0-18416c16884a", color: "darkgray", image: "flipped.png", style: "centered-image" },
        notflipped: { id: "c77f43e8-674f-4011-891d-8f5dbd6c3712", color: "lightgray", image: "notflipped.png", style: "centered-image" },
        decktop: { id: "27f967dc-02db-4d4f-9132-8cdb73e838ad", value:"high noon", color: "marigold", image: "cowboy/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "d0935ad3-d6c8-4276-af18-7bf2293e6f90" },
        hiddenVote: { id: "3b6794ff-ab4a-473a-9fa3-764a5fae885f" },
    },
    {
        id: "dceb86fb-ce37-4343-86b0-e0fb54d69792",
        name: "Safari",
        type: "Fibonacci",
        cards: [
            { id: "1106d7d0-fc6a-4bf7-8ab5-95a20fd301d2", value: "0", color: "apricot", image: "safari/0bird.png", font: "large", style: "value-image" },
            { id: "f016c908-5dcb-4a2f-bb36-180d22478fb3", value: "1", color: "tangerine", image: "safari/1rabbit.png", font: "large", style: "value-image" },
            { id: "638b200f-3f08-44a3-b778-fe972f9c6a23", value: "2", color: "lime", image: "safari/2fox.png", font: "large", style: "value-image" },
            { id: "35700aae-e5fc-41ff-8d0f-69f76295ffb9", value: "3", color: "mint", image: "safari/3puma.png", font: "large", style: "value-image" },
            { id: "b014fb16-f2ea-4ad6-ab9f-333523e2daf2", value: "5", color: "jade", image: "safari/5wolf.png", font: "large", style: "value-image" },
            { id: "1565394d-f99c-4fc3-9c09-2740c2f413e2", value: "8", color: "sky", image: "safari/8zebra.png", font: "large", style: "value-image" },
            { id: "bd5ae9fc-e113-47ee-8e6c-ba355ad0c7f6", value: "13", color: "ocean", image: "safari/13lion.png", font: "large", style: "value-image" },
            { id: "24ac7bd1-a1cc-4b77-9d72-b2e80ee99918", value: "21", color: "flamingo", image: "safari/21rhino.png", font: "large", style: "value-image" },
            { id: "4ca71656-e325-45bf-9cde-1987c0fa1f58", value: "34", color: "bubblegum", image: "safari/34elephant.png", font: "large", style: "value-image" },
            { id: "98a35d13-1982-4047-9bbe-6e394f7d5dd9", value: "\u221e", color: "slate", image: "safari/whenpigsfly.png", font: "large", style: "value-image" },
            { id: "20b97770-03aa-4da8-bb69-1f6549005de9", value: "?", color: "ruby", image: "safari/chameleon.png", font: "large", style: "value-image" },
            { id: "8b3698c9-b738-417b-aa2c-bf87c8028998", value: "break", color: "marigold", image: "safari/paws.png", font: "small", style: "value-image" },
        ],
        flipped: { id: "478c865a-4846-448b-8fea-b7968f0bacda", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "5a2958e1-5538-4c11-8a0b-5e558d79ee82", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "3d532349-a396-4e9a-a528-cb8184f4ff59", value:"safari" ,color: "marigold", image: "safari/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "159c6ad45-4fba-4ff0-936a-cddccf44d54b" },
        hiddenVote: { id: "bb63cd4a-68f5-4fb5-a700-288c985972f5" },
    },
    {
        id: "ed5590e9-4b9d-4fd4-b4e6-156776d4a088",
        name: "Sweets",
        type: "Fibonacci",
        cards: [
            { id: "933ce078-eaa0-42db-b7b0-e7d8fc14507d", value: "0", color: "sky", image: "sweets/0candy.png", font: "large", style: "value-image" },
            { id: "cf3f0c42-709c-4407-9d77-fbab0439a12e", value: "1", color: "flamingo", image: "sweets/1lollipop.png", font: "large", style: "value-image" },
            { id: "b9869cd9-955f-403d-a97a-d590722a6794", value: "2", color: "gingerbread", image: "sweets/2gingerbread.png", font: "large", style: "value-image" },
            { id: "1c86aa0a-317c-4586-a1c8-30fc3180d862", value: "3", color: "seafoam", image: "sweets/3popsicle.png", font: "large", style: "value-image" },
            { id: "d085f376-8e8e-4e53-a46a-c1177b375ff9", value: "5", color: "teal", image: "sweets/5softserve.png", font: "large", style: "value-image" },
            { id: "24559b7c-386c-4199-927e-5eeca3a719a4", value: "8", color: "bubblegum", image: "sweets/83scoops.png", font: "large", style: "value-image" },
            { id: "481d29ec-ca20-4e2d-a083-15714931aff8", value: "13", color: "ocean", image: "sweets/13cake.png", font: "large", style: "value-image" },
            { id: "fcc0f2f7-426d-42ae-aefe-b52edaf3cd6d", value: "21", color: "lime", image: "sweets/21pie.png", font: "large", style: "value-image" },
            { id: "8ba9fb86-3205-4d72-9d6a-2afaef74b5ff", value: "34", color: "purplesky", image: "sweets/34fullcake.png", font: "large", style: "value-image" },
            { id: "0e118b82-3efc-4562-a79d-7053c9bee255", value: "\u221e", color: "silverfox", image: "sweets/infinitedonuts.png", font: "large", style: "value-image" },
            { id: "b30c125f-9098-4c42-acb3-e98b0e7259ce", value: "?", color: "ruby", image: "sweets/boxochocolates.png", font: "large", style: "value-image" },
            { id: "266b88d6-9430-4652-a19a-caf40917c122", value: "break", color: "marigold", image: "sweets/coffee.png", font: "small", style: "value-image" },
        ],
        flipped: { id: "b886dca0-ed81-4775-ace5-1e23be058d89", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "3a99c737-777d-4a05-b776-9c6957fed247", color: "lightgray", image: "notflipped.png", style: "centered-image" },
        decktop: { id: "e37dc4df-e755-45ac-87fd-77e73aa771d6", value:"sweets", color: "marigold", image: "sweets/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "fbd74112-f02e-4fe2-b485-e34a37c5da33" },
        hiddenVote: { id: "1deec477-ba32-4a19-a3fb-3ddfcb4dfe23"},
    },
    {
        id: "57d08bfd-107b-4957-9c7a-abc45ab1a53e",
        name: "Space",
        type: "Fibonacci",
        cards: [
            { id: "c9271442-f180-4aea-ab46-099dd86c821b", value:"0", color: "marigold", image: "space/0spaceinvader.png", font: "large", style: "value-image" },
            { id: "f7bc2afd-6fe1-4e51-8aa9-5a29ac1e0e2e", value:"1", color: "tangerine", image: "space/1lasergun.png", font: "large", style: "value-image" },
            { id: "4bbecb22-9b12-4d41-82c9-e1828e80b084", value:"2", color: "tangerine", image: "space/2helmet.png", font: "large", style: "value-image" },
            { id: "eba5c9f3-8a06-4032-b5de-14bbe6fc49fa", value:"3", color: "tangerine", image: "space/3satellite.png", font: "large", style: "value-image" },
            { id: "9a20370c-7b11-494b-95af-2bcdd040d5ee", value:"5", color: "coral", image: "space/5flyingsaucer.png", font: "large", style: "value-image" },
            { id: "bd164f7d-fc07-4b6d-b3c7-29892863bd70", value:"8", color: "coral", image: "space/8spaceshuttle.png", font: "large", style: "value-image" },
            { id: "5e08b0d6-1829-432a-a77c-1daf838e85c4", value:"13", color: "coral", image: "space/13comet.png", font: "large", style: "value-image" },
            { id: "69ba5e5f-414e-49bb-8d68-aac28bb309bc", value:"21", color: "bubblegum", image: "space/21moon.png", font: "large", style: "value-image" },
            { id: "d8bba192-a396-4a7f-8cf7-b70bf8488608", value:"34", color: "bubblegum", image: "space/34galaxy.png", font: "large", style: "value-image" },
            { id: "aba3d7d6-462d-4a7d-8ea9-d36c42a9c4b0", value:"\u221e", color: "teal", image: "space/blackhole.png", font: "large", style: "value-image" },
            { id: "c4560fbe-5bfc-4a23-810c-c5bdb2a8fec7", value:"?", color: "ocean", image: "space/idkalien.png", font: "large", style: "value-image" },
            { id: "8984f43e-cc66-4a9f-aaba-adb48dce1d6d", value:"break", color: "jade", image: "space/pausewatchstar.png", font: "small", style: "value-image" },
        ],
        flipped: { id: "c5cc3e7f-f13a-4944-b6a9-a822e40f9194", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "76c5290d-57ba-47b2-a07d-454f903e1bb5", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "c0df441a-55b5-4505-92e0-ea76467134d0", value: "space", color: "marigold", image: "space/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "b71eada1-8cc2-43d9-a4c2-d14a7273822a"},
        hiddenVote: { id: "4bdab345-d6a8-4204-84b9-b7e333d660fe"},
    },
    {
        id: "b1371f01-c90e-4f08-97d8-3f627bed00d7",
        name: "Mad Hatter",
        type: "Fibonacci",
        cards: [
            { id: "f080073c-8128-432b-8c7a-79716acc796f", value:"0", color: "marigold", image: "hats/justhat1.png", font:"large", style: "value-image" },
            { id: "5c8557b0-aafa-448a-98ea-4436ed28c2ca", value:"1", color: "tangerine", image: "hats/justhat2.png", font: "large", style: "value-image" },
            { id: "3fb640e3-e23a-4858-b527-1d417c00ab27", value:"2", color: "tangerine", image: "hats/justhat3.png", font: "large", style: "value-image" },
            { id: "72a5bcdf-1e61-4a77-a157-6f3886ec2f0c", value:"3", color: "tangerine", image: "hats/justhat5.png", font: "large", style: "value-image" },
            { id: "0547b2b6-8ddd-417c-99be-12c6cdacecdc", value:"5", color: "coral", image: "hats/justhat6.png", font: "large", style: "value-image" },
            { id: "917e1252-7364-4cb7-b1ec-cabd330e6713", value:"8", color: "coral", image: "hats/justhat7.png", font: "large", style: "value-image" },
            { id: "60e7a51e-376f-4496-8c53-8f2ec090c0d8", value:"13", color: "coral", image: "hats/justhat9.png", font: "large", style: "value-image" },
            { id: "57e2badd-2241-4194-a9a3-7add0d23becf", value:"21", color: "bubblegum", image: "hats/justhat10.png", font: "large", style: "value-image" },
            { id: "54d1b4b8-fd52-4309-9e3e-199e95ec59dd", value:"34", color: "bubblegum", image: "hats/justhat11.png", font: "large", style: "value-image" },
            { id: "41b7ece3-3e30-4621-9e0a-77ed17a76047", value:"\u221e", color: "teal", image: "hats/justhat8.png", font: "large", style: "value-image" },
            { id: "562f6301-8ab2-4403-8bbf-b5c70b7834c1", value:"?", color: "ocean", image: "hats/justhat4.png", font: "large", style: "value-image" },
            { id: "f603cbfd-aa36-45fd-ab67-400f9840cebe", value:"break", color: "jade", image: "hats/justhat12.png", font: "small", style: "value-image" }
        ],
        flipped: { id: "989c3d4a-4ef3-499f-8a89-5d50a242279e", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "65fb957c-3c5f-4e7c-90bb-1a88ccd6f592", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "762e9421-1d62-4bbd-9ff3-a913f3cda257", value: "mad hatter", color: "marigold", image: "hats/justhat11.png", font: "small", style: "image-value" },
        noVote: { id: "7b18ee88-6896-411f-8a67-64beba17697c"},
        hiddenVote: { id: "a8506996-b2e2-4eb3-a284-23746a2f7072"},
    },
    {
        id: "4b471014-79a4-4d96-b390-adfb5b635cc0",
        name: "Clothes",
        type: "Shirt",
        cards: [
            { id: "971fe01b-a5ae-4877-9c27-2ae295432c5f", value: "XS", color: "apricot", image: "clothes/sunglassesXS.png", font: "large", style: "value-image" },
            { id: "fe154142-3fa6-4a02-bbf9-48fd3a4bab62", value: "S", color: "flamingo", image: "clothes/hatS.png", font: "large", style: "value-image" },
            { id: "90bf8457-409a-4015-bdc8-767c71add1d1", value: "M", color: "bubblegum", image: "clothes/bootsM.png", font: "large", style: "value-image" },
            { id: "96fbf466-bf4a-4ae8-b9b3-dc7275f48da0", value: "L", color: "teal", image: "clothes/pantsL.png", font: "large", style: "value-image" },
            { id: "c2b67db3-34bd-4d89-a42e-ec283728caba", value: "XL", color: "slate", image: "clothes/shirtXL.png", font: "large", style: "value-image" },
            { id: "8312f7d3-dd5d-4f87-90d6-707c13d14872", value: "XXL", color: "seafoam", image: "clothes/jacketXXL.png", font: "large", style: "value-image" },
            { id: "f79e9275-1e63-4a88-bf6f-f242efb4b1bd", value: "\u221e", color: "ocean", image: "clothes/clothesoff.png", font: "large", style: "value-image" },
            { id: "a764d0ac-873d-44d2-bb05-938333cda7c8", value: "?", color: "mulberry", image: "clothes/clothingunknown.png", font: "large", style: "value-image" },
            { id: "cb72f12e-c216-4987-83a8-08e8402a4b4f", value: "break", color: "marigold", image: "clothes/clothesdaquiri.png", font: "small", style: "value-image" },
        ],
        flipped: { id: "7981818d-7deb-48e6-a316-df5a7e971603", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "debcbe36-eedd-47c2-b0d6-6aec358f1ab4", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "61feba68-93df-4515-a6ad-d7ee8a19b63e", value: "clothes", color: "marigold", image: "clothes/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "c0a9addb-a001-45cb-9b98-d85d9c775158" },
        hiddenVote: { id: "23eb3394-60ce-46fc-99a5-a3e49a51e3d5" },
    },
    {
        id: "86537c64-0932-4213-beb9-a9abd1e44cd0",
        name: "Undies",
        type: "Shirt",
        cards: [
            { id: "892ad7fb-916d-436d-943b-541cf3433088", value: "XS", color: "apricot", image: "undies/thongXS.png", font: "large", style: "value-image" },
            { id: "d89d0e78-b6fd-4a2b-b295-3eeae70aeeb2", value: "S", color: "flamingo", image: "undies/undiesS.png", font: "large", style: "value-image" },
            { id: "d298b631-504c-4bab-a13d-660a3528acbb", value: "M", color: "bubblegum", image: "undies/undiesM.png", font: "large", style: "value-image" },
            { id: "0052fdb1-150f-4b80-a4e2-6e23e18f7353", value: "L", color: "teal", image: "undies/braL.png", font: "large", style: "value-image" },
            { id: "7947adcc-2e5f-4f08-9b48-8ce93bb5967c", value: "XL", color: "slate", image: "undies/corsetXL.png", font: "large", style: "value-image" },
            { id: "3dbdcc0b-6f96-4f40-8be3-f2ae5bb28ec3", value: "XXL", color: "seafoam", image: "undies/corsetXXL.png", font: "large", style: "value-image" },
            { id: "026b52ec-289c-443b-a2a2-fbc6b4795e27", value: "\u221e", color: "ocean", image: "undies/undieswonderwoman.png", font: "large", style: "value-image" },
            { id: "e0b0fd91-f18e-43ce-a050-814fee29f976", value: "?", color: "mulberry", image: "undies/undiesunknown.png", font: "large", style: "value-image" },
            { id: "a3adc7e8-ca5b-4d7b-a326-7882639ef7c8", value: "break", color: "marigold", image: "undies/undiesmartini.png", font: "small", style: "value-image" }
        ],
        flipped: { id: "3e07498c-8cb1-4b89-9ba2-f268ec18be97", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "06c60ffc-5de8-4545-87f4-ffdad47482f5", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "ab5ce47a-6a7c-44ba-823c-9de10a1eff5e", value: "undies", color: "marigold", image: "undies/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "8afbcbbe-91b2-4126-962b-d2734bea0370"},
        hiddenVote: { id: "24d0de11-6638-4952-a639-6cd0834e32c3"},
    },
    {
        id: "c8fb83a9-f483-46e5-ab8f-88d9183c7730",
        name: "Triage",
        type: "Clever",
        cards: [
            { id: "a09e2fc6-631f-4b3e-abf3-754db4e0f529", value: "blocker", color: "ruby", image: "triage/1stop.png", style: "image-value", font: "small" },
            { id: "5083f0cc-fa43-4818-af24-6ca37f43ec04", value: "must", color: "jade", image: "triage/2star.png", style: "image-value", font: "small"},
            { id: "79a98b79-1fab-40fb-812b-ea02b27409a0", value: "want", color: "flamingo", image: "triage/6heart.png", style: "image-value", font: "small" },
            { id: "993a73ee-47f9-40ed-bf70-471ccf147196", value: "won't", color: "corn", image: "triage/7stophand.png", style: "image-value", font: "small" },
            { id: "0d7bf888-3a89-4a50-9276-279177a9387a", value: "don't know", color: "seafoam", image: "triage/triquestion.png", style: "image-value", font: "small" },
            { id: "c93cab8f-4a3d-4f50-9fce-87f0e161c950", value: "break", color: "teal", image: "triage/tricoffee.png", style: "image-value", font: "small" },
        ],
        flipped: { id: "b222d05f-8bdb-4680-a41b-152d71e35e15", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "3f6de1a7-fe88-4ecd-bba2-a2173d7fde44", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "d72b84b8-4e32-49db-b9d3-5bdf9a703f49", value: "triage", color: "marigold", image: "triage/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "9cefe527-7ee9-4bda-bf7a-b4d648f570a8"},
        hiddenVote: { id: "1abf9bf3-a3d9-498a-8b0e-161c1965e41a"},
    },
    {
        id: "dd622593-e100-4622-a018-94c11a5b656e",
        name: "Assess",
        type: "Clever",
        cards: [
            { id: "5ea7297b-7b2c-46de-b7da-28deda66a06d", value: "urgent", color: "marigold", image: "triage/9fire.png", style: "image-value", font: "small" },
            { id: "b9e90c73-fcec-4e63-ac62-1a4654d52d8f", value: "time sensitive", color: "bubblegum", image: "triage/4tribomb.png", style: "image-value", font: "small" },
            { id: "9ddfd107-9cdd-4646-b882-2e5d5022f833", value: "strategic", color: "sky", image: "triage/5plan.png", style: "image-value", font: "small" },
            { id: "40217d7b-b160-4914-88f1-85cbfb61f722", value: "opportunity", color: "lime", image: "triage/11keys.png", style: "image-value", font: "small" },
            { id: "7bd0bad4-b85f-432a-ac9d-cc48b1f2783a", value: "exploratory", color: "ocean", image: "triage/12diver.png", style: "image-value", font: "small" },
            { id: "0800a56a-c732-4a3a-b844-324cdd4d2998", value: "pet", color: "purplesky", image: "triage/8dog.png", style: "image-value", font: "small" },
            { id: "af4657e4-c812-4fed-8bc9-42ec6d183037", value: "rabbit hole", color: "gingerbread", image: "triage/10rabbithole.png", style: "image-value", font: "small" },
            { id: "7a46b84f-2319-46e4-96a3-c96021c27f94", value: "\u221e", color: "silverfox", image: "triage/tridanger.png", style: "image-value", font: "small" },
            { id: "288281e0-85ba-4e36-b620-afed40e2e3fb", value: "don't know", color: "seafoam", image: "triage/triquestion.png", style: "image-value", font: "small" },
            { id: "3918f40a-9ab9-443c-9bf4-777b80ca5e07", value: "break", color: "teal", image: "triage/tricoffee.png", style: "image-value", font: "small" },
        ],
        flipped: { id: "b7b0df27-4a97-4185-bc79-0b1c5f67ef85", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "dc50e094-4f18-4136-b4a2-55f84eded4e9", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "1b173b9c-fc90-4f0b-8eb1-9750ba1e0006", value: "assess", color: "marigold", image: "triage/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "c57743b4-a4a3-4160-9fba-f6fb0b1d491e"},
        hiddenVote: { id: "0498e3e7-8ef6-4bbe-bfb2-8766281209cc"},
    },
    {
        id: "ce6020cc-64bb-4522-bb09-d91327b80122",
        name: "In or out",
        type: "Clever",
        cards: [
            { id: "2136a3ba-0704-43ca-8aeb-3fb554b7b3d5", value: "excellent", color: "teal", image: "ruin/yeslets.png", font: "small", style: "value-image" },
            { id: "bdb766be-d3d4-4102-b0ea-3e846bb1ba33", value: "not keen", color: "cherrybomb", image: "ruin/nogo.png", font: "small", style: "value-image" },
            { id: "7638f98c-0d22-45b9-9cd6-581ba7d71e71", value: "not sure", color: "marigold", image: "ruin/idk.png", font: "small", style: "value-image" },
            { id: "3d7b88f4-7fc7-463a-9823-fa222a8dd18d", value: "yes, I'll help", color: "ocean", image: "ruin/plusone.png", font: "small", style: "value-image" },
        ],
        flipped: { id: "c0fc6c64-90a4-452b-a598-345dcb1c7a13", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "86ef058d-bcc2-4ac0-80c6-0f4dcf46a7ea", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "f6badfdc-e2b1-47c7-84f9-fcd9dafe9173", value: "in or out", color: "marigold", image: "ruin/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "002799b1-801f-4853-a82e-18f60a9bec20"},
        hiddenVote: { id: "fd0607a8-b173-4450-b725-c103a8b28e07"},
    },
    {
        id: "57617df0-b1d8-4ed4-8fe0-c743419844b7",
        name: "Yes or no",
        type: "Clever",
        cards: [
            { id: "90275285-d5b0-44e1-96db-4dcf8ed27f69", value: "yes", color: "lime", image: "simpletrio/check.png", font: "small", style: "value-image"},
            { id: "5a86258b-6dd1-4854-a1b3-022f18e2d177", value: "no", color: "cherrybomb", image: "simpletrio/x.png", font: "small", style: "value-image" },
            { id: "e9d4172c-f733-4ba0-9800-4ee049dfbae4", value: "maybe", color: "marigold", image: "simpletrio/maybe.png", font: "small", style: "value-image" }
        ],
        flipped: { id: "105a0ad8-0dc0-462c-a8f1-fe00cebc5f4b", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "e06cb73b-e58f-4482-9d36-7af74cd114d3", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "92406e6d-269f-462d-8724-b643c056ff0e", value: "yes or no", color: "marigold", image: "simpletrio/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "8cc9d232-1f28-4e8a-b739-0303c4307feb"},
        hiddenVote: { id: "c3d7fd09-a028-4534-a8a8-0322c86557f2"},
    },
    {
        id: "219f2994-5304-4359-b093-5815798fa6f0",
        name: "Calendar",
        type: "Clever",
        cards: [
            { id: "f8550231-4d7c-450d-b56d-5be6cb6c5a8e", value: "monday", color: "apricot", image: "dayz/calendar.png", font: "small", style: "value-image" },
            { id: "0ebd54ef-2f68-4076-866c-c3baa4661e9e", value: "tuesday", color: "flamingo", image: "dayz/calendar.png", font: "small", style: "value-image" },
            { id: "ca4f82c1-d338-4f36-8e30-bed053854c4f", value: "wednesday", color: "bubblegum", image: "dayz/calendar.png", font: "small", style: "value-image" },
            { id: "af157648-83c1-4e4f-96cf-e79c210ffd43", value: "thursday", color: "mint", image: "dayz/calendar.png", font: "small", style: "value-image" },
            { id: "4b09c37a-cd4f-4cdf-8261-4664e6b99148", value: "friday", color: "jade", image: "dayz/calendar.png", font: "small", style: "value-image" },
            { id: "b9813ef0-c4bc-46da-90e1-daa28354b839", value: "saturday", color: "seafoam", image: "dayz/calendar.png", font: "small", style: "value-image" },
            { id: "ed45da6d-5d2a-437a-bda5-fa89ff45ba0c", value: "sunday", color: "ocean", image: "dayz/calendar.png", font: "small", style: "value-image" },
            { id: "8f40ffc2-2103-425e-b9eb-db40aff0ba49", value: "no date", color: "slate", image: "dayz/nodate.png", font: "small", style: "value-image" }
        ],
        flipped: { id: "a917d9d3-5a3e-46ef-8cfb-c0bac14d7fb5", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "847992cd-e32d-4289-9255-c98d1193268c", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "6ccb8ab7-42d9-479a-b489-23d7afc6531a", value: "calendar", color: "marigold", image: "dayz/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "962df92e-bca7-4c00-96f2-e405d14d71ed"},
        hiddenVote: { id: "2eea9bff-8185-46d2-b674-8616aa15d511"},
    },
    {
        id: "3d0a7e32-d6bb-4e75-96da-b10c0982ee7d",
        name: "Agree?",
        type: "Clever",
        cards: [
            { id: "6bc991bd-935c-4fb4-8331-f0c80d1ce17a", value: "strongly disagree", color: "bubblegum", image: "likert/1mad.png", font: "small", style: "value-image" },
            { id: "e8de2ec6-cf0e-42db-87c8-f55edd5e53eb", value: "disagree", color: "flamingo", image: "likert/2unhappy.png", font: "small", style: "value-image" },
            { id: "c3077754-1511-4b35-9811-b2ad3a800a85", value: "neutral", color: "sky", image: "likert/3neutral.png", font: "small", style: "value-image" },
            { id: "1b992ba5-5cac-440e-88f6-3caf5451700b", value: "agree", color: "mint", image: "likert/4happy.png", font: "small", style: "value-image" },
            { id: "3aec7db9-a34a-4de3-9e29-acf5809f75d6", value: "strongly agree", color: "jade", image: "likert/5joy.png", font: "small", style: "value-image" },
            { id: "f7c03c58-4a48-4188-aa83-fdbc6193fa84", value: "don't know", color: "marigold", image: "likert/noidea.png", font: "small", style: "value-image" },
            { id: "62ff0f89-d612-4166-b26b-f91690601e38", value: "not applicable", color: "apricot", image: "likert/na.png", font: "small", style: "value-image" },
            { id: "f207bfd7-dfeb-4e00-b50d-4e6d016ee76d", value: "break", color: "slate", image: "likert/coffee.png", font: "small", style: "value-image" },
        ],
        flipped: { id: "4d9702ae-2cd2-4be2-baef-9b91df3cdd1c", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "68b65cb9-9d83-4b6b-8fe9-b635b1ba1506", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "ef9c3944-6f8b-4ff5-b2bb-8048fb459740", value: "agree?", color: "marigold", image: "likert/decktop.png", font: "small", style: "image-value" },
        noVote: { id: "d9ecca1d-0861-41e4-b3e9-1a407bbdab19"},
        hiddenVote: {id: "9f450e96-2429-421d-b39d-74522af8da5a"},
    },
    {
        id: "b534565a-d3f0-495e-994b-b5e8852c49f4",
        name: "Dice",
        type: "Clever",
        cards: [
            {  id: "3f310148-3989-48fa-ae52-de854e487758", value: "1", color: "bubblegum", image: "dice/dice1.png", font: "large", style: "value-image" },
            {  id: "f8ba82a1-9e62-4db6-8728-b734da4d576f", value: "2", color: "flamingo", image: "dice/dice2.png", font: "large", style: "value-image" },
            {  id: "c30175ba-a760-4f86-a5de-0b6ec48c918a", value: "3", color: "sky", image: "dice/dice3.png", font: "large", style: "value-image" },
            {  id: "0bf50e61-1247-4c62-9095-d98b5f9b8a46", value: "4", color: "mint", image: "dice/dice4.png", font: "large", style: "value-image" },
            {  id: "5e9d5e62-6a13-4f91-aa5d-bf66d8070d1b", value: "5", color: "jade", image: "dice/dice5.png", font: "large", style: "value-image" },
            {  id: "4857d4d9-c948-49a6-a7d0-242c68d000be", value: "6", color: "marigold", image: "dice/dice6.png", font: "large", style: "value-image" },
        ],
        flipped: { id: "a30bc68f-6f24-4da0-894e-3e4b60834c5b", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "c61e3373-0d4c-462e-8d27-4bbbbdd3724b", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "cd609996-a247-470c-87a8-bef9b66d0c2e", value: "dice", color: "marigold", image: "dice/dice6.png", font: "small", style: "image-value" },
        noVote: { id: "258a220e-8fc0-44bd-a7e4-17c0e8ec8009"},
        hiddenVote: { id: "37413a52-1456-4e51-8b5e-34461f801818"},
    },
    {
        id: "865220d1-e53b-469d-b098-82745f1fe646",
        name: "Energy",
        type: "Clever",
        cards: [
            { id: "7a8adaa0-009d-4429-a003-c0391cfa9b1e", value: "0", color: "bubblegum", image: "energy/energy0.png", font: "large", style: "value-image" },
            { id: "ce5c1240-acb9-4188-95b4-01e2172d2ee1", value: "1", color: "flamingo", image: "energy/energy1.png", font: "large", style: "value-image" },
            { id: "fac63b7e-2cc9-4909-baab-31cad87c11af", value: "2", color: "sky", image: "energy/energy2.png", font: "large", style: "value-image" },
            { id: "edecd113-5011-4814-a06f-3af77ad9d95e", value: "3", color: "mint", image: "energy/energy3.png", font: "large", style: "value-image" },
            { id: "9c418d67-c2cc-4f58-ab28-0c2a63d88043", value: "4", color: "jade", image: "energy/energy4.png", font: "large", style: "value-image" },
        ],
        flipped: { id: "13e7a032-1f6f-48ee-b7b4-45875df3a1c7", color: "darkgray", image: "flipped.png", style: "centered-image"},
        notflipped: { id: "127da1c9-493f-48aa-a1e5-b393d75ac752", color: "lightgray", image: "notflipped.png", style: "centered-image"},
        decktop: { id: "041850c3-4a58-43b4-872d-33945272b809", value: "energy", color: "marigold", image: "energy/energy4.png", font: "small", style: "image-value" },
        noVote: { id: "cb0192d7-a840-4d0b-8466-b134ec1738c9"},
        hiddenVote: { id: "c8719019-dc8d-413e-9e09-64e80bc77153"},
    }
];


const deckFilters: DeckCategoryFilter[] = [
    {
        name: "All",
        decks: decks.map(d => d.id)
    },
    {
        name: "Fibonacci",
        decks: decks.filter(d => d.type == "Fibonacci").map(d => d.id)
    },
    {
        name: "Shirt",
        decks: decks.filter(d => d.type == "Shirt").map(d => d.id)
    },
    {
        name: "Clever",
        decks: decks.filter(d => d.type == "Clever").map(d => d.id)
    }
];


const decksCollection: DecksCollection = {
    decks: decks,
    deckFilters: deckFilters,
}


export default decksCollection;
