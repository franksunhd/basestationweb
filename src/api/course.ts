export  const courses = [
  { id: "1", name: "web全栈架构师", price: 99 },
  { id: "2", name: "web⾼级⼯程师", price: 99 },
];
// const courses = ["web全栈架构师", "web⾼级⼯程师"];
export function getCourses() {
  return Promise.resolve(courses);
}
export function getCourseById(id:any) {
  return Promise.resolve(courses.find(c => c.id == id));
}
export function addCourse(id:any) {
  
  return Promise.resolve(true);
}

