import React from 'react';
import { Link } from 'react-router-dom'

function TableData(props) {
    let counter = 0
    let date = Date.now()
    function keyGenerator() {
        return `${date}${++counter}`
    }
    const [tableData,path] = props.callback(props.data)
    return (
        <div className="table-responsive">
            <table className="text-center table table-striped table-sm table-bordered table-hover">
                <thead>
                    <tr>
                        {props.heads.map(head => <th key={keyGenerator()} >{head}</th>)}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map(element => {
                        return (
                            <tr key={keyGenerator()}>
                                {element[0].map(elm => <td key={keyGenerator()}>{elm}</td>)}
                                <td>
                                    <Link className="btn btn-sm btn-outline-primary" to={path+element[1]}>More/Edit</Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TableData
