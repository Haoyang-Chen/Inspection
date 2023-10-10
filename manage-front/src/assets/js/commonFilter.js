export function filterWorkTypes(val) {
    switch (val) {
        case 1:
            return '动火作业';
        case 2:
            return '受限空间作业';
        case 3:
            return '高处作业';
        case 4:
            return '吊装作业';
        case 5:
            return '临时用电作业';
        case 6:
            return '动土作业';
        case 7:
            return '断路作业';
        case 8:
            return '盲板抽堵作业';
        default:
            return '-';
    }
}