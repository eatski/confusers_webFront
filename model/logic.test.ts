import { exportForTest, getAvailableDestinations } from "./logic";
import { Cell } from "./types";

const {toCellsMap} = exportForTest;

const cells : Cell[] = [
    {x:0,y:0,content: {type: "ISLAND"}},{x:0,y:1,content: {type: "ISLAND"}},{x:0,y:2,content: {type: "ISLAND"}},
    {x:1,y:0,content: {type: "SEA"}},{x:1,y:1,content: {type: "SEA"}},{x:1,y:2,content: {type: "SEA"}},
    {x:2,y:0,content: {type: "SEA"}},{x:2,y:1,content: {type: "SEA"}},{x:2,y:2,content: {type: "ISLAND"}},
]

describe(toCellsMap.name, () => {
    test("found",() => {
        const map = toCellsMap(cells);
        expect(map.get({x:2,y:2})).toEqual({
            x:2,y:2,content: {type: "ISLAND"}
        })
        expect(map.get({x:1,y:1})).toEqual({
            x:1,y:1,content: {type: "SEA"}
        })
    })
    test("not found",() => {
        const map = toCellsMap(cells);
        expect(map.get({x:3,y:3})).toEqual(null)
    })
})

describe(getAvailableDestinations.name,() => {
    test("Straight",() => {
        const res1 = getAvailableDestinations({type:"Straight",number:2},cells,{x:2,y:2});
        const espected1 : typeof res1 = [{next:{x:0,y:2},use:{type:"Straight",direction:"X-"}}]
        expect(res1).toEqual(espected1);
        const res2 = getAvailableDestinations({type:"Straight",number:2},cells,{x:0,y:2});
        const espected2 : typeof res2 = [{next:{x:2,y:2},use:{type:"Straight",direction:"X+"}}]
        expect(res2).toEqual(espected2);
        const res3 = getAvailableDestinations({type:"Straight",number:1},cells,{x:0,y:1});
        const expected3 : typeof res3 = [
            {next:{x:0,y:2},use:{type:"Straight",direction:"Y+"}},
            {next:{x:0,y:0},use:{type:"Straight",direction:"Y-"}}
        ]
        expect(res3).toEqual(expected3);
    })
    test("Curved",() => {
        const res1 = getAvailableDestinations({type:"Curved",number:[1,2]},cells,{x:2,y:2});
        const expected1 : typeof res1 = [
            {next:{x:0,y:1},use:{type:"Curved",direction:["Y-","X-"]}},
        ]
        expect(res1).toEqual(expected1);
        const res2 = getAvailableDestinations({type:"Curved",number:[2,1]},cells,{x:2,y:2});
        const expected2 : typeof res2 = []
        expect(res2).toEqual(expected2);
    })
})