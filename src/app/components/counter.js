"use client"
import { useState } from "react";
import { Button } from "@mui/material";

export default function Counter() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <Button onClick={()=>setCount(count+1)} variant="contained" color="primary">{count}</Button>
        </div>
    );
}