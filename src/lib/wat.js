import { simpleMode } from '@codemirror/legacy-modes/mode/simple-mode'
import {StreamLanguage} from "@codemirror/language"

// https://codemirror.net/5/demo/simplemode.html
const old = simpleMode({
  start: [
    // string
    {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},

    // keyword
    {regex: /return|global|module|export|elem|type|local.get|table|memory|func|param|result/, token: "string"},

    // number
    {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},

    // indent and dedent properties guide autoindentation
    {regex: /([\(])/, indent: true},
    {regex: /([\))]/, dedent: true},

    // function name
    {regex: /[\(](?:.*)\y/, token: "keyword"},

  ]
})

export const wat = StreamLanguage.define(old)
