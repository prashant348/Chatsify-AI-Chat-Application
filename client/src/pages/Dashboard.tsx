import { UserButton } from "@clerk/clerk-react";

import { HomeIcon } from "lucide-react";
import { SettingsIcon } from "lucide-react";
export default function Dashboard() {

    return (
        <>
            <div className="p-[20px]">
                <h1>Dashboard 📊</h1>
                <UserButton afterSignOutUrl="/">
                    <UserButton.UserProfileLink label="Homepage" url="/" labelIcon={<HomeIcon />} />
                    <UserButton.UserProfilePage label="terms and cond" url="terms" labelIcon={<SettingsIcon />}>
                        <div>
                            <h1>Custom Terms Page</h1>
                            <p>This is the content of the custom terms page.</p>
                        </div>
                    </UserButton.UserProfilePage>
                </UserButton>
            </div>
        </>
    )
}