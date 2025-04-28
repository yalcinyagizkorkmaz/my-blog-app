import Counter from "../components/counter";

export default async function Users() {
    const res=await fetch("https://jsonplaceholder.typicode.com/users");
    const data=await res.json();
    return (
        <div>
            <h1>Users</h1>
            <div>
                <ul>
                    {data.map((user)=>(
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
            <Counter />
        </div>
    );
}