import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LunchSchedule() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", lunchTime: "12:00 PM", status: "Available" },
    { id: 2, name: "Jane Smith", lunchTime: "12:30 PM", status: "Available" },
    { id: 3, name: "Mike Johnson", lunchTime: "1:00 PM", status: "Available" },
  ]);
  const [newName, setNewName] = useState("");
  const [newLunchTime, setNewLunchTime] = useState("");

  const updateStatus = (id, newStatus) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, status: newStatus } : emp
      )
    );
  };

  const updateLunchTime = (id, newTime) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, lunchTime: newTime } : emp
      )
    );
  };

  const addEmployee = () => {
    if (newName && newLunchTime) {
      setEmployees((prev) => [
        ...prev,
        { id: Date.now(), name: newName, lunchTime: newLunchTime, status: "Available" },
      ]);
      setNewName("");
      setNewLunchTime("");
    }
  };

  const removeEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lunch Schedule</h2>
      <div className="mb-4 flex space-x-2">
        <Input
          type="text"
          placeholder="Employee Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Lunch Time"
          value={newLunchTime}
          onChange={(e) => setNewLunchTime(e.target.value)}
        />
        <Button onClick={addEmployee}>Add</Button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Lunch Time</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">{emp.name}</td>
              <td className={`border border-gray-300 p-2 ${emp.status === "Available" ? "text-green-600" : "text-red-600"}`}>{emp.status}</td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="text"
                  className="w-24"
                  value={emp.lunchTime}
                  onChange={(e) => updateLunchTime(emp.id, e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2 space-x-2">
                <Button variant="outline" onClick={() => updateStatus(emp.id, "Available")}>Available</Button>
                <Button variant="outline" onClick={() => updateStatus(emp.id, "On Break")}>On Break</Button>
                <Button variant="outline" onClick={() => updateStatus(emp.id, "At Lunch")}>At Lunch</Button>
                <Button variant="destructive" onClick={() => removeEmployee(emp.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
