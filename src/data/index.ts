import {type Map} from "../store/game/map.ts";

export interface LevelGameData {
    map: Map;
    player: { x: number, y: number };
    cargos: { x: number, y: number }[];
    targets: { x: number, y: number }[];
}

export type GameData = LevelGameData[];

export const gameData: GameData = [
    {
        "map": [
            [
                1,
                1,
                1,
                0,
                1,
                1,
                1
            ],
            [
                1,
                2,
                1,
                1,
                1,
                2,
                1
            ],
            [
                1,
                2,
                2,
                2,
                2,
                2,
                1
            ],
            [
                1,
                2,
                2,
                2,
                2,
                2,
                1
            ],
            [
                1,
                2,
                2,
                2,
                2,
                2,
                1
            ],
            [
                1,
                2,
                2,
                2,
                2,
                2,
                1
            ],
            [
                1,
                1,
                1,
                1,
                1,
                1,
                1
            ]
        ],
        "player": {
            "x": 3,
            "y": 3
        },
        "cargos": [
            {
                "x": 3,
                "y": 2
            },
            {
                "x": 3,
                "y": 4
            },
            {
                "x": 4,
                "y": 3
            },
            {
                "x": 2,
                "y": 3
            }
        ],
        "targets": [
            {
                "x": 1,
                "y": 5
            },
            {
                "x": 5,
                "y": 5
            },
            {
                "x": 1,
                "y": 1
            },
            {
                "x": 5,
                "y": 1
            }
        ]
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1]
        ],
        player: {
            x: 1,
            y: 4
        },
        cargos: [
            {
                x: 1,
                y: 3
            },
            {
                x: 2,
                y: 4
            },
            {
                x: 3,
                y: 1
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 2,
                y: 3
            }
        ],
        targets: [
            {
                x: 1,
                y: 1
            },
            {
                x: 2,
                y: 1
            },
            {
                x: 1,
                y: 3
            },
            {
                x: 1,
                y: 4
            },
            {
                x: 2,
                y: 4
            }
        ]
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        player: {
            x: 3,
            y: 3
        },
        cargos: [
            {
                x: 2,
                y: 2
            },
            {
                x: 2,
                y: 3
            },
            {
                x: 2,
                y: 4
            },
            {
                x: 3,
                y: 4
            },
            {
                x: 4,
                y: 4
            },
            {
                x: 4,
                y: 3
            },
            {
                x: 4,
                y: 2
            },
            {
                x: 3,
                y: 2
            }
        ],
        targets: [
            {
                x: 1,
                y: 1
            },
            {
                x: 5,
                y: 1
            },
            {
                x: 5,
                y: 3
            },
            {
                x: 5,
                y: 5
            },
            {
                x: 1,
                y: 5
            },
            {
                x: 4,
                y: 4
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 3,
                y: 3
            }
        ]
    },
];