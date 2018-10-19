/**
 * Created by Nikolay Matvienko on 4/25/18.
 */

module.exports = {
    graphiteHost: 'plaintext://cc5d5e19.carbon.hostedgraphite.com:2003/',
    routes: ['', 'a', 'aa', 'b', 'bb', 'c', 'cc', 'cca', 'ccb', 'cp', 'cpa',
        'cpb', 'cpc', 'ddd', 'h', 'ho', 'holyy', 'holyjs', 'holyholy', 'hol',],
    port: 3000,
    cpuData: {
        micro: {
            set: [100, -1, -142, 43, -58, 184, 0, 42],
            sum: 42
        },
        macro: {
            set: [50, 99, -50, -42, -58, -2, -10, 17, 42, 40, 60, 10, 1000],
            sum: 0
        }
    }
};
