import { useNavigate } from "react-router-dom";

function RolePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>Loading...</p>;

  const handleRoleClick = (role) => {
    if (user.role === role) {
      navigate(`/${role.toLowerCase()}/dashboard`);
    } else {
      alert("You are not authorized for this role!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome {user.name}</h2>
      <p>Select your role:</p>
      <button onClick={() => handleRoleClick("ADMIN")}>Admin</button>
      <button onClick={() => handleRoleClick("TEACHER")}>Teacher</button>
      <button onClick={() => handleRoleClick("STUDENT")}>Student</button>
    </div>
  );
}

export default RolePage;
