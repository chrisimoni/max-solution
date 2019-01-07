//const input  = require('./inputs/input');
//const singleArr = [{ name: 'Patrick', dob: new Date('2015-10-15'), regNo: '19', } ];

/**
 * This is the entry point to the program
 *
 * @param {array} input Array of student objects
 */
function classifier(input) {

  //Throw error if the input is not an array
  if(!Array.isArray(input)) {
    throw Error('Invalid input');
  }

  //For a single value of array. If the length of the array is 1
  if(input.length == 1) {
    let output = {
      noOfGroups: input.length,
      group1: {
        members: [{
          name: input.name,
          dob: input.dob,
          regNo: input.regNo
        }]
      }
    };

    return output;
  }

  //If the input is empty
  if(input.length == 0) {
    return  {
      noOfGroups: 0
    }
  }


  //Generating new student array and adding age property
  const students = clone(input).map((item) => {
    item.age = getAge(item.dob);
    return item
  });

  //Sorting the student's array by age
  students.sort((a, b) => a.age - b.age);

  const groups = [];
  let group = [];

  //Looping through each student's object
  for (let student of students) {
    if ((group.length < 3) && (group.length == 0 || (student.age - group[0].age) <= 5)) {
        //Add student to group
        group.push(student);
    } else {
        //Generating new group and adding students
        groups.push(group); 
        group = [] ;
        group.push(student);
    }
  }

  //For some reasons i couldnt get last group of students added to the the groups array
  //Did some workaround to add the last group (which contains the last group of students) into the groups array
  groups.push(group); 

  let output = {
    noOfGroups: groups.length
  };

  //Iterating through each groups array
  groups.map((group, index) => {
    let members = [],
        sum = 0,
        regNos = [];
    //Iterating through each group array
    group.map(student => {
        members.push({
            name: student.name,
            dob: student.dob,
            regNo: student.regNo,
            age: student.age
        });
        sum += student.age; 
        regNos.push(Number(student.regNo));
    });

    //Sorting regNos in ascending order
    regNos.sort((a, b) => a - b);

    return output[`group${index + 1}`] = {
        members,
        oldest: group[group.length - 1].age,
        sum,
        regNos
    }

  });
  
  return output;
  
}

//Function to clone an array
function clone (src) {
  return JSON.parse(JSON.stringify(src));
}

//Function to calculate age
function getAge(dateString) {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }

  return age;
}

//console.log(classifier(input));


module.exports = classifier;
