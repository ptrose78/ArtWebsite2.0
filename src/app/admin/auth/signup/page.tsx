import {handleSignup} from "@/app/lib/actions";

export default async function Signup() {

    return(
        <div>
            <form action={handleSignup}>
                <label className="mt-2"></label>
                <input
                    type="text"
                    name="username"
                    
                    placeholder="username"
                    required
                />
                <label className="mt-2"></label>
                <input
                    type="password"
                    name="password"
                   
                    placeholder="password"
                    required
                />
                <button>Submit</button>
            </form>
        </div>
    )
}