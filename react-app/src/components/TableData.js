import React from 'react';

function TableData(props) {
    let counter = 0
    let date = Date.now()
    function keyGenerator() {
        return `${date}${++counter}`
    }
    const tableData = props.callback(props.data)
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
                                {element.map(elm => <td key={keyGenerator()}>{elm}</td>)}
                                <td>
                                    <a className="btn btn-sm btn-outline-primary" href="#">More/Edit</a>
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
