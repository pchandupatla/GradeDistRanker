import './App.css'
import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Axios from 'axios'
import { Bar } from 'react-chartjs-2'

function SubGraph (props) {
  const state = {
    labels: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
    datasets: [
      {
        label: 'Count',
        backgroundColor: [
          '#99ff99',
          '#ccff99',
          '#ffe14d',
          '#ffad33',
          '#ff704d',
          '#ff704d',
          '#ff704d',
          '#ff704d',
          '#ff704d',
          '#ff704d',
          '#ff704d',
          '#ff704d'
        ],
        borderWidth: 1,
        data: props.list
      }
    ]
  }

  const options = {}

  const bar = (
    <div>
      <h1 className='SubGraphTitle'>
        Grade Distribution for {props.dept + props.num} ({props.name}) - {props.prof},{' '}
        {props.sem}
      </h1>
      <Bar data={state} options={options} height={50} />
    </div>
  )

  return bar
}

//new subgraphparent here (on effect, reload the data based on the new semester, pass effect data into subgraph)
function SubGraphParent (props) {
  const [semester, setSemester] = useState('Aggregate')
  const name = props.name
  const num = props.num
  const dept = props.dept
  const prof = props.prof
  const aggList = props.list

  useEffect(() => {
    //make graph update
    updateGraph()
  }, [semester])

  const updateGraph = () => {
    if (semester === 'Aggregate') {
      ReactDOM.render(
        <SubGraph
          list={aggList}
          prof={prof}
          num={num}
          dept={dept}
          sem={semester}
          name={name}
        />,
        document.getElementById('ClassGraph')
      )
    } else {
      //Query for specific semester data and pass into the subgraph component
      ReactDOM.render(
        'NOT IMPLEMENTED YET',
        document.getElementById('ClassGraph')
      )
    }
    // alert(dept +" " + num + " "+semester)
  }

  const createSelect = () => {
    return (
      <div>
        <label id='SemesterLabel'>Semester:</label>
        <select className='Select' value={semester} onChange={handleSelect}>
          <option>Aggregate</option>
          <option>Fall 2013</option>
          <option>Fall 2014</option>
          <option>Fall 2015</option>
          <option>Fall 2016</option>
          <option>Fall 2018</option>
          <option>Fall 2019</option>
          <option>Spring 2014</option>
          <option>Spring 2015</option>
          <option>Spring 2016</option>
          <option>Spring 2017</option>
          <option>Spring 2019</option>
          <option>Spring 2020</option>
          <option>Summer 2016</option>
        </select>
      </div>
    )
  }

  const handleSelect = event => {
    setSemester(event.target.value)
  }

  return createSelect()
}

function Graph ({ gradeList }) {
  const labels = []
  const data = []
  gradeList.forEach(element => {
    labels.push(element.prof)
    data.push(element.percentage)
  })

  const handleClick = (e, element) => {
    //reactdom render here, create select, as select changes, re-render subgraphparent
    if (element.length > 0) {
      ReactDOM.render('', document.getElementById('Select'))
      ReactDOM.render('', document.getElementById('ClassGraph'))
      //initialize relevant data
      const index = element[0].index
      const relData = gradeList[index]
      const name = relData.course_name
      const num = relData.course_nbr
      const dept = relData.dept
      const prof = relData.prof
      const list = []
      list.push(relData.a2)
      list.push(relData.a3)
      list.push(relData.b1)
      list.push(relData.b2)
      list.push(relData.b3)
      list.push(relData.c1)
      list.push(relData.c2)
      list.push(relData.c3)
      list.push(relData.d1)
      list.push(relData.d2)
      list.push(relData.d3)
      list.push(relData.f)

      //reactdom render subgraphparent
      // alert(index)
      ReactDOM.render(
        <SubGraphParent
          name={name}
          num={num}
          dept={dept}
          prof={prof}
          list={list}
        />,
        document.getElementById('Select')
      )
    }
  }

  const state = {
    labels: labels,
    datasets: [
      {
        label: 'Percentage As',
        backgroundColor: '#99ff99',
        borderWidth: 1,
        data: data
      }
    ]
  }

  const options = {
    onClick: handleClick
  }

  const bar = (
    <div>
      <h1 className='GraphTitle'>Aggregate Percentage As Per Professor</h1>
      <Bar data={state} options={options} height={100} />
    </div>
  )

  return bar
}

function GraphParent (props) {
  const [gradeList, setGradeList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    updateList()
  }, [props.num, props.dept, props.name])

  const updateList = () => {
    Axios.get('http://localhost:3001/ranked', {
      params: { name: props.name, num: props.num, dept: props.dept }
    }).then(response => {
      setGradeList(response.data)
      setLoading(false)
    })
  }

  return <div>{!loading && <Graph gradeList={gradeList} />}</div>
}

function App () {
  const [dept, setDept] = useState('')
  const [num, setNum] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = () => {
    ReactDOM.render('', document.getElementById('Select'))
    ReactDOM.render('', document.getElementById('ClassGraph'))
    ReactDOM.render(
      <GraphParent name={name} dept={dept} num={num} />,
      document.getElementById('MainGraph')
    )
  }

  return (
    <div className='App'>
      <header></header>
      <div className='Form'>
        <p>Department:</p>
        <select
          className='Select'
          value={dept}
          onChange={event => {
            setDept(event.target.value)
          }}
        >
          <option value=''></option>
          <option>ACC</option>
          <option>AAS</option>
          <option>ACF</option>
          <option>ADV</option>
          <option>AED</option>
          <option>AET</option>
          <option>AFR</option>
          <option>AFS</option>
          <option>AHC</option>
          <option>ALD</option>
          <option>AMS</option>
          <option>ANS</option>
          <option>ANT</option>
          <option>ARA</option>
          <option>ARC</option>
          <option>ARE</option>
          <option>ARH</option>
          <option>ARI</option>
          <option>ART</option>
          <option>ASE</option>
          <option>ASL</option>
          <option>AST</option>
          <option>B A</option>
          <option>BCH</option>
          <option>BDP</option>
          <option>BGS</option>
          <option>BIO</option>
          <option>BME</option>
          <option>C C</option>
          <option>C E</option>
          <option>C L</option>
          <option>C S</option>
          <option>CGS</option>
          <option>CH</option>
          <option>CHE</option>
          <option>CHI</option>
          <option>CLD</option>
          <option>CMS</option>
          <option>COE</option>
          <option>COM</option>
          <option>CRP</option>
          <option>CRW</option>
          <option>CSD</option>
          <option>CSE</option>
          <option>CTI</option>
          <option>CZ</option>
          <option>DAN</option>
          <option>DCH</option>
          <option>DES</option>
          <option>E</option>
          <option>E E</option>
          <option>E M</option>
          <option>E S</option>
          <option>ECO</option>
          <option>EDA</option>
          <option>EDC</option>
          <option>EDP</option>
          <option>EER</option>
          <option>ELP</option>
          <option>ENM</option>
          <option>ENS</option>
          <option>EUS</option>
          <option>EVE</option>
          <option>EVS</option>
          <option>F A</option>
          <option>F C</option>
          <option>FIN</option>
          <option>FR</option>
          <option>G E</option>
          <option>GEO</option>
          <option>GER</option>
          <option>GK</option>
          <option>GOV</option>
          <option>GRC</option>
          <option>GRG</option>
          <option>GSD</option>
          <option>H E</option>
          <option>H S</option>
          <option>HCT</option>
          <option>HDF</option>
          <option>HDO</option>
          <option>HEB</option>
          <option>HED</option>
          <option>HIN</option>
          <option>HIS</option>
          <option>HMN</option>
          <option>I B</option>
          <option>ILA</option>
          <option>IMS</option>
          <option>INF</option>
          <option>IRG</option>
          <option>ISL</option>
          <option>ITC</option>
          <option>ITD</option>
          <option>ITL</option>
          <option>J</option>
          <option>J S</option>
          <option>JPN</option>
          <option>KIN</option>
          <option>KOR</option>
          <option>L A</option>
          <option>LAH</option>
          <option>LAR</option>
          <option>LAS</option>
          <option>LAT</option>
          <option>LAW</option>
          <option>LEB</option>
          <option>LIN</option>
          <option>M</option>
          <option>M E</option>
          <option>M S</option>
          <option>MAL</option>
          <option>MAN</option>
          <option>MAS</option>
          <option>MBU</option>
          <option>MDV</option>
          <option>MEL</option>
          <option>MES</option>
          <option>MIS</option>
          <option>MKT</option>
          <option>MNS</option>
          <option>MOL</option>
          <option>MRT</option>
          <option>MUS</option>
          <option>N</option>
          <option>N S</option>
          <option>NEU</option>
          <option>NOR</option>
          <option>NSC</option>
          <option>NTR</option>
          <option>None</option>
          <option>O M</option>
          <option>ORI</option>
          <option>P A</option>
          <option>P R</option>
          <option>P S</option>
          <option>PBH</option>
          <option>PED</option>
          <option>PGE</option>
          <option>PGS</option>
          <option>PHL</option>
          <option>PHM</option>
          <option>PHR</option>
          <option>PHY</option>
          <option>POL</option>
          <option>POR</option>
          <option>PRC</option>
          <option>PRS</option>
          <option>PSY</option>
          <option>R E</option>
          <option>R M</option>
          <option>R S</option>
          <option>REE</option>
          <option>RHE</option>
          <option>RTF</option>
          <option>RUS</option>
          <option>S S</option>
          <option>S W</option>
          <option>SAB</option>
          <option>SAN</option>
          <option>SCA</option>
          <option>SCI</option>
          <option>SDS</option>
          <option>SED</option>
          <option>SEL</option>
          <option>SLA</option>
          <option>SOC</option>
          <option>SPC</option>
          <option>SPN</option>
          <option>SSC</option>
          <option>STA</option>
          <option>STC</option>
          <option>STM</option>
          <option>SUS</option>
          <option>SWE</option>
          <option>T C</option>
          <option>T D</option>
          <option>TAM</option>
          <option>TEL</option>
          <option>TXA</option>
          <option>UGS</option>
          <option>URB</option>
          <option>URD</option>
          <option>UTL</option>
          <option>UTS</option>
          <option>VAS</option>
          <option>WGS</option>
          <option>WRT</option>
          <option>YID</option>
          <option>YOR</option>
        </select>
        <p>Course Number:</p>
        <input
          className='TextInput'
          type='text'
          onChange={event => {
            setNum(event.target.value)
          }}
        ></input>
        <p>Course Title:</p>
        <input
          className='TextInput'
          type='text'
          onChange={event => {
            setName(event.target.value)
          }}
        ></input>
        <br></br>
        <input
          type='submit'
          value='Submit'
          className='Submit'
          onClick={handleSubmit}
        ></input>
      </div>
      <div id='MainGraph'></div>
      <div id='SubGraph'>
        <div id='Select'></div>
        <div id='ClassGraph'></div>
      </div>
    </div>
  )
}

export default App
