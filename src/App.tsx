/*
 * Copyright 2025 agwlvssainokuni
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {useState} from "react"
import {useParams} from "react-router-dom"
import {Container, Stack, TextField, Typography} from "@mui/material"
import {
    addMonths,
    addYears,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    isPast,
    isValid,
    lightFormat,
    parseISO,
    startOfToday
} from "date-fns"

const App = () => {
    const [birthday, setBirthday] = useState("")
    const [birthday37th, setBirthday37th] = useState<Date>()
    const [duration37th, setDuration37th] = useState<{
        past: boolean,
        years: number,
        months: number,
        days: number,
        fullDays: number,
    }>()
    const {yearsOld = "37"} = useParams<{ yearsOld: string }>()

    const handleBirthday = (v: string) => {
        setBirthday(v)

        const bd = parseISO(v)
        if (!isValid(bd)) {
            setBirthday37th(undefined)
            setDuration37th(undefined)
            return
        }

        // 37歳の誕生日を算出。
        const bd37th = addYears(bd, Number.parseInt(yearsOld))
        setBirthday37th(bd37th)

        // 37歳の誕生日までの期間を算出。
        const past = isPast(bd37th)
        const today = startOfToday()
        const years = differenceInYears(bd37th, today)
        const months = differenceInMonths(bd37th, addYears(today, years))
        const days = differenceInDays(bd37th, addMonths(addYears(today, years), months))
        const fullDays = differenceInDays(bd37th, today)
        setDuration37th({past, years, months, days, fullDays})
    }

    return (
        <Container maxWidth={"sm"}>
            <Container>
                <Typography variant={"h3"} marginTop={1} marginBottom={2}>
                    🍀{yearsOld}🍀 タイマー
                </Typography>
            </Container>
            <Container>
                <Stack marginTop={4} marginBottom={4}>
                    <TextField
                        variant={"outlined"}
                        size={"small"}
                        helperText={"生年月日を入力してください。"}
                        type={"date"}
                        value={birthday}
                        onChange={(e) => handleBirthday(e.target.value)}
                    />
                </Stack>
            </Container>
            <Container>
                <Stack marginBottom={4} spacing={2}>
                    <Typography variant={"h5"} textAlign={"center"}>
                        {!birthday37th ?
                            `${yearsOld}歳 の誕生日を計算します。` :
                            lightFormat(
                                birthday37th,
                                `${yearsOld}歳 の誕生日は yyyy年MM月dd日 です。`
                            )
                        }
                    </Typography>
                    <Typography variant={"h5"} textAlign={"center"}>
                        {!duration37th ?
                            `${yearsOld}歳 までの年月日数を計算します。` :
                            duration37th.past ?
                                `${yearsOld}歳 と ` +
                                `${-duration37th.years}年 ` +
                                `${-duration37th.months}か月 ` +
                                `${-duration37th.days}日 です。`
                                :
                                `${yearsOld}歳 まで ` +
                                `${duration37th.years}年 ` +
                                `${duration37th.months}か月 ` +
                                `${duration37th.days}日 です。`
                        }
                    </Typography>
                    <Typography variant={"h5"} textAlign={"center"}>
                        {!duration37th ?
                            `${yearsOld}歳 までの日数を計算します。` :
                            duration37th.past ?
                                `${yearsOld}歳 と ` +
                                `${-duration37th.fullDays}日 です。`
                                :
                                `${yearsOld}歳 まで ` +
                                `${duration37th.fullDays}日 です。`
                        }
                    </Typography>
                </Stack>
            </Container>
            <Container>
                <Typography marginTop={1} marginBottom={1} textAlign={"center"}>
                    Copyright &copy;, 2025, agwlvssainokuni
                </Typography>
            </Container>
        </Container>
    )
}

export default App
