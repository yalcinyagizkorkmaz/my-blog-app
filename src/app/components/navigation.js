"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { green } from "@mui/material/colors";
import Image from "next/image";

export default function Navigation() {
    const pathname = usePathname();
    console.log(pathname);
    
    return (
        <AppBar position="static" sx={{ backgroundColor: green[500] }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Image src="/vercel.svg" alt="logo" width={32} height={32} />
                    <Button component={Link} href="/" color="inherit">Ana Sayfa</Button>
                    <Button component={Link} href="/blogs" color="inherit">Blog Yazıları</Button>
                    <Button component={Link} href="/register" color="inherit">Kayıt Ol</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}